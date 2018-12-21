import { LineBot, LineHandler } from "bottender";
import * as fs from "fs";
import { IFigure } from "./Figure";
import * as moment from "moment";
import config from "./config";

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

const splitText = (text, length) => {
  if (text.length > length) {
    return text.substr(0, length - 3) + "...";
  } else {
    return text;
  }
};

export const multicastFigures = async (figures: IFigure[]) => {
  for (let figure of figures) {
    const releaseDate = moment(figure.release_date);
    const title = splitText(figure.name, 30);
    const text = splitText(
      `${releaseDate.format("YYYY年MM月")}發售\n${figure.price}`,
      60
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
