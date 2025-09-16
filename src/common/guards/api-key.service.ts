import { Injectable } from '@nestjs/common';

/**
 * Simple ApiKeyService for demo purposes.
 * In production you would store keys securely (database/secret manager)
 * and support scopes/expiration.
 */
@Injectable()
export class ApiKeyService {
  private keys: Set<string>;

  constructor() {
    // Read API keys from environment variable (comma-separated) for demo
    const raw = process.env.API_KEYS ?? 'my-demo-api-key';
    this.keys = new Set(raw.split(',').map(k => k.trim()).filter(Boolean));
  }

  validate(key?: string | null): boolean {
    if (!key) return false;
    return this.keys.has(key);
  }
}

export default ApiKeyService;
