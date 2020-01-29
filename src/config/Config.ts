import { resolve } from 'path';

import { config as dotConfig } from 'dotenv';

dotConfig({ path: resolve(__dirname, '../../.env') });

export class Config {
  env: string;
  port: number;
  lineAccessToken: string;
  lineChannelSecret: string;
  sentryDSN: string;

  constructor() {
    this.env = process.env.ENV || 'development';
    this.port = parseInt(process.env.PORT || '3000');
    this.lineAccessToken = process.env.LINE_ACCESS_TOKEN || '';
    this.lineChannelSecret = process.env.LINE_CHANNEL_SECRET || '';
    this.sentryDSN = process.env.SENTRY_DSN || '';
  }

  isProduction(): boolean {
    return this.env === 'production';
  }
}

export const config = new Config();
