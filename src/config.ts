interface App {
  isOffline: boolean;
  env: "dev" | "prod";
}

interface AWS {
  accessKeyId: string;
  secretAccessKey: string;
  region: "ap-northeast-1";
  s3WebURL: string;
}

interface LINE {
  channelSecret: string;
  accessToken: string;
}

interface Config {
  app: App;
  aws: AWS;
  line: LINE;
}

const config: Config = {
  app: {
    isOffline: !!process.env.IS_OFFLINE,
    env: process.env.ENV as "dev" | "prod"
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_ACCESS_REGION as any,
    s3WebURL: process.env.S3_WEB_URL
  },
  line: {
    accessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
  }
};

export default config;
