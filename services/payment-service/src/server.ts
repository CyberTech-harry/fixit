import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Middleware & Security
server.register(cors, {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
});

server.register(helmet, {
  contentSecurityPolicy: false,
});

// In-memory idempotency & transaction store (isolated per service instance)
interface PaymentRecord {
  checkoutRequestId: string;
  orderId: string;
  phoneNumber: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  mpesaReceipt?: string;
  createdAt: Date;
  updatedAt: Date;
  provider: 'daraja' | 'payhero';
}

const transactionLedger = new Map<string, PaymentRecord>();
const processedReceipts = new Set<string>();

// Health Endpoint
server.get('/health', async () => {
  return {
    status: 'healthy',
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    transactionsTracked: transactionLedger.size,
  };
});

// 1. Daraja 3.0 OAuth Token Generator
async function getDarajaToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || 'sandbox_key';
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'sandbox_secret';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const baseUrl = process.env.MPESA_ENV === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

  const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    throw new Error(`Daraja OAuth failed with HTTP ${res.status}`);
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// Validation Schemas
const StkPushRequestSchema = z.object({
  phoneNumber: z.string().min(9).max(14),
  amount: z.number().positive(),
  orderId: z.string().min(1),
  accountReference: z.string().default('FixIT-Portal'),
  transactionDesc: z.string().default('Service Payment'),
});

// 2. Daraja 3.0 STK Push Endpoint
server.post('/api/v1/payments/mpesa/stkpush', async (request, reply) => {
  const parseResult = StkPushRequestSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      issues: parseResult.error.format(),
    });
  }

  const { phoneNumber, amount, orderId, accountReference, transactionDesc } = parseResult.data;

  // Format phone to 254XXXXXXXXX
  let phone = phoneNumber.replace(/\D/g, '');
  if (phone.startsWith('0')) phone = '254' + phone.slice(1);
  if (phone.startsWith('+')) phone = phone.slice(1);

  const shortcode = process.env.MPESA_SHORTCODE || '174379';
  const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const baseUrl = process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://api.cybertechcomps.com/api/v1/payments/mpesa/callback';

  try {
    let token = 'mock_sandbox_token';
    if (process.env.MPESA_CONSUMER_KEY) {
      token = await getDarajaToken();
    }

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    const res = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json() as {
      CheckoutRequestID?: string;
      ResponseCode?: string;
      ResponseDescription?: string;
      CustomerMessage?: string;
    };

    const checkoutId = data.CheckoutRequestID || `mock-${Date.now()}`;

    // Record in isolated transaction ledger
    transactionLedger.set(checkoutId, {
      checkoutRequestId: checkoutId,
      orderId,
      phoneNumber: phone,
      amount,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: 'daraja',
    });

    return reply.send({
      success: true,
      checkoutRequestId: checkoutId,
      customerMessage: data.CustomerMessage || 'Prompt sent to handset. Please enter your M-Pesa PIN.',
      responseDescription: data.ResponseDescription || 'Success',
    });
  } catch (err: any) {
    server.log.error(err);
    return reply.status(502).send({
      success: false,
      error: 'Failed to initiate M-Pesa STK Push with provider',
      details: err.message,
    });
  }
});

// 3. Daraja Asynchronous Callback Webhook with Idempotency
server.post('/api/v1/payments/mpesa/callback', async (request, reply) => {
  try {
    const body: any = request.body;
    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) {
      return reply.send({ ResultCode: 0, ResultDesc: 'Accepted empty body' });
    }

    const resultCode = stkCallback.ResultCode;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultDesc = stkCallback.ResultDesc;

    const record = transactionLedger.get(checkoutRequestId);

    if (resultCode === 0) {
      const items: any[] = stkCallback.CallbackMetadata?.Item || [];
      const receipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;

      // Idempotency: Prevent duplicate order processing
      if (receipt && processedReceipts.has(receipt)) {
        server.log.warn(`Duplicate webhook receipt received: ${receipt}. Acknowledging without re-credit.`);
        return reply.send({ ResultCode: 0, ResultDesc: 'Duplicate acknowledged' });
      }

      if (receipt) {
        processedReceipts.add(receipt);
      }

      if (record) {
        record.status = 'COMPLETED';
        record.mpesaReceipt = receipt;
        record.updatedAt = new Date();
      }

      server.log.info(`Payment verified for CheckoutID: ${checkoutRequestId}, Receipt: ${receipt}`);
    } else {
      if (record) {
        record.status = 'FAILED';
        record.updatedAt = new Date();
      }
      server.log.warn(`Payment failed for CheckoutID: ${checkoutRequestId}, Reason: ${resultDesc}`);
    }

    return reply.send({ ResultCode: 0, ResultDesc: 'Callback processed' });
  } catch (err: any) {
    server.log.error(err);
    return reply.send({ ResultCode: 0, ResultDesc: 'Acknowledged with error logged' });
  }
});

// 4. PayHero Express STK Push
server.post('/api/v1/payments/payhero/stkpush', async (request, reply) => {
  const parseResult = StkPushRequestSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      issues: parseResult.error.format(),
    });
  }

  const { phoneNumber, amount, orderId } = parseResult.data;
  const apiKey = process.env.PAYHERO_API_KEY;
  const apiSecret = process.env.PAYHERO_API_SECRET;
  const channelId = process.env.PAYHERO_CHANNEL_ID;

  if (!apiKey || !apiSecret) {
    return reply.status(503).send({
      success: false,
      error: 'PayHero credentials not configured on payment microservice',
    });
  }

  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const callbackUrl = process.env.PAYHERO_CALLBACK_URL || 'https://api.cybertechcomps.com/api/v1/payments/payhero/webhook';

  try {
    const res = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        phone_number: phoneNumber,
        channel_id: parseInt(channelId || '0'),
        provider: 'm-pesa',
        external_reference: orderId,
        callback_url: callbackUrl,
      }),
    });

    const data = await res.json();
    return reply.send({ success: true, data });
  } catch (err: any) {
    server.log.error(err);
    return reply.status(502).send({ success: false, error: err.message });
  }
});

// 5. Query Transaction Status
server.get('/api/v1/payments/status/:checkoutRequestId', async (request, reply) => {
  const { checkoutRequestId } = request.params as { checkoutRequestId: string };
  const record = transactionLedger.get(checkoutRequestId);

  if (!record) {
    return reply.status(404).send({
      success: false,
      error: 'Transaction record not found in payment ledger',
    });
  }

  return reply.send({
    success: true,
    record,
  });
});

// Start Microservice
const PORT = parseInt(process.env.PORT || '4001', 10);
const HOST = process.env.HOST || '0.0.0.0';

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Payment microservice running at ${address}`);
});
