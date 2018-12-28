import config from "../config";

export const getTableName = (table: string) => {
  return `figure_bot_${table}_${config.app.env}`;
};
