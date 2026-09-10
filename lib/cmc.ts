/**
 * FixIt IT Web - Central Management Console (CMC) Client Connector
 * Handles zero-trust cryptographic handshake and HMAC-SHA256 heartbeats.
 */
import crypto from 'node:crypto';

export interface CmcConfig {
  apiUrl?: string;
  projectId?: string;
  environmentId?: string;
  connectorSecret?: string;
}

export class CmcConnectorClient {
  private apiUrl: string;
  private projectId: string;
  private environmentId: string;
  private connectorSecret: string;

  constructor(config: CmcConfig = {}) {
    this.apiUrl = config.apiUrl || process.env.CMC_API_URL || 'https://cmc.htechnologies.co.ke';
    this.projectId = config.projectId || process.env.CMC_PROJECT_ID || '';
    this.environmentId = config.environmentId || process.env.CMC_ENVIRONMENT_ID || '';
    this.connectorSecret = config.connectorSecret || process.env.CMC_CONNECTOR_SECRET || '';
  }

  async handshake(bootstrapToken: string) {
    const res = await fetch(`${this.apiUrl}/v1/connector/handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bootstrap_token: bootstrapToken,
        project_id: this.projectId,
        environment_id: this.environmentId,
        connector_version: '1.0.0',
        capabilities: ['health', 'content', 'cache', 'events'],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Handshake failed (${res.status}): ${data.error}`);
    }

    this.connectorSecret = data.data.connector_secret;
    return data.data;
  }

  signPayload(payload: Record<string, unknown> = {}) {
    if (!this.connectorSecret) {
      throw new Error('CMC Connector secret missing. Complete handshake or set CMC_CONNECTOR_SECRET.');
    }

    const timestamp = new Date().toISOString();
    const nonce = crypto.randomUUID();
    const stringified = JSON.stringify(payload);
    const payloadToSign = `${timestamp}:${nonce}:${stringified}`;

    const secretHash = crypto.createHash('sha256').update(this.connectorSecret).digest('hex');
    const signature = crypto
      .createHmac('sha256', secretHash)
      .update(payloadToSign, 'utf8')
      .digest('hex');

    return {
      'Content-Type': 'application/json',
      'X-Project-ID': this.projectId,
      'X-Environment-ID': this.environmentId,
      'X-Timestamp': timestamp,
      'X-Nonce': nonce,
      'X-Signature': signature,
    };
  }

  async sendHeartbeat(status: 'operational' | 'degraded' | 'offline' = 'operational') {
    const body = { status, uptime_seconds: Math.round(process.uptime()) };
    const headers = this.signPayload(body);
    const res = await fetch(`${this.apiUrl}/v1/connector/heartbeat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return res.ok;
  }
}
