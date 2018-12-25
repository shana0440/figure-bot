interface App {
  isOffline: boolean;
  env: "dev" | "prod";
}

interface LINE {
  channelSecret: string;
  accessToken: string;
}

interface Config {
  app: App;
  line: LINE;
}

const config: Config = {
  app: {
    isOffline: !!process.env.IS_OFFLINE,
    env: process.env.ENV as "dev" | "prod"
  },
  line: {
    accessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
  }
};

export default config;
