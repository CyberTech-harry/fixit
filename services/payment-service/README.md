# Payment Microservice (Safaricom Daraja 3.0 & PayHero Gateway)

Standalone payment processing microservice isolated from the frontend documentation portal.

## Capabilities
- Safaricom Daraja 3.0 OAuth token acquisition and Lipa Na M-Pesa Online STK Push dispatch.
- Asynchronous callback webhook handling with receipt deduplication (idempotency).
- PayHero Kenya multi-channel STK push and IPN validation.
- Transaction ledger tracking and health status probes.

## Architecture & Isolation
- **Port**: `4001`
- **Isolation**: Payment secrets (`MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`) are isolated inside this service container.
- **Health Check**: `GET /health`

## Endpoints
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status |
| `POST` | `/api/v1/payments/mpesa/stkpush` | Initiate Safaricom STK Push |
| `POST` | `/api/v1/payments/mpesa/callback` | Webhook callback from Safaricom |
| `POST` | `/api/v1/payments/payhero/stkpush` | Initiate PayHero Express Payment |
| `GET` | `/api/v1/payments/status/:id` | Query transaction status |

## Running Locally
```bash
npm install
npm run dev
```

## Docker Deployment
```bash
docker build -t cybertech/payment-service:latest .
docker run -p 4001:4001 --env-file .env cybertech/payment-service:latest
```
