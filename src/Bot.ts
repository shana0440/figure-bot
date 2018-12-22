import { LineBot, LineHandler } from "bottender";
import * as fs from "fs";
import * as _ from "lodash";
import * as moment from "moment";
import { IFigure } from "./models/figure";
import config from "./config";

// TODO: get from s3
const usersFile = `./share/users.json`;
const users: string[] = fs.existsSync(usersFile)
  ? JSON.parse(fs.readFileSync(usersFile).toString())
  : [];

const bot = new LineBot({
  channelSecret: config.line.channelSecret,
  accessToken: config.line.accessToken
});

const handler = new LineHandler()
  .onFollow(async context => {
    users.push(context.session.user.id);
    fs.writeFile(usersFile, JSON.stringify(users), () => {});
  })
  .onUnfollow(async context => {
    const index = users.indexOf(context.session.user.id);
    users.splice(index, 1);
    fs.writeFile(usersFile, JSON.stringify(users), () => {});
  });

bot.onEvent(handler);

export const BotServer = bot;

export const multicastFigures = async (figures: IFigure[]) => {
  for (let figure of figures) {
    const releaseDate = moment(figure.releaseDate);
    const title = _.truncate(figure.name, { length: 30 });
    const text = _.truncate(
      `${releaseDate.format("YYYY年MM月")}發售\n${figure.price}`,
      { length: 60 }
    );
    const template = {
      type: "buttons",
      thumbnailImageUrl: figure.image,
      title: title,
      text: text,
      actions: [
        {
          type: "uri",
          label: "Open Browser",
          uri: figure.url
        }
      ]
    };
    await bot._connector._client.multicastTemplate(users, title, template);
  }
};
