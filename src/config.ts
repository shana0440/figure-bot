interface App {
  isOffline: boolean;
  env: "dev" | "prod";
}

interface AWS {
  accessKeyId: string;
  secretAccessKey: string;
  region: "ap-northeast-1";
}

interface Config {
  app: App;
  aws: AWS;
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
  }
};

export default config;
