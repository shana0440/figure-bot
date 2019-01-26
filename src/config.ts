interface App {
  isOffline: boolean;
  env: "dev" | "prod";
}

interface AWS {
  bucket: string;
}

interface LINE {
  channelSecret: string;
  accessToken: string;
}

interface Sentry {
  dsn: string;
}

interface Config {
  app: App;
  aws: AWS;
  line: LINE;
  sentry: Sentry;
}

const config: Config = {
  app: {
    isOffline: !!process.env.IS_OFFLINE,
    env: process.env.ENV as "dev" | "prod"
  },
  aws: {
    bucket: process.env.S3_BUCKET
  },
  line: {
    accessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
  },
  sentry: {
    dsn: process.env.SENTRY_DSN
  }
};

export default config;
