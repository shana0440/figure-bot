interface App {
  isOffline: boolean;
  env: "dev" | "prod";
}

interface AWS {
  accessKeyId: string;
  secretAccessKey: string;
  region: "ap-northeast-1";
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
    accessKeyId: "",
    secretAccessKey: "",
    region: "" as any
  },
  line: {
    accessToken: "",
    channelSecret: ""
  }
};

export default config;
