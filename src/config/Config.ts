import { resolve } from 'path';

import { config as dotConfig } from 'dotenv';

export interface Config {
  lineAccessToken: string;
  lineChannelSecret: string;
}

dotConfig({ path: resolve(__dirname, '../../.env') });

export const config: Config = {
  lineAccessToken: process.env.LINE_ACCESS_TOKEN || '',
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
