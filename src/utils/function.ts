import config from "../config";

export const getFunctionName = (fn: string): string => {
  return `figure-bot-${config.app.env}-${fn}`;
};
