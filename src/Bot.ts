import * as fs from "fs";
import * as _ from "lodash";
import { Client, TemplateButtons, TemplateMessage } from "@line/bot-sdk";
import * as moment from "moment";
import { IFigure } from "./models/figure";
import config from "./config";

const client = new Client({
  channelAccessToken: config.line.accessToken,
  channelSecret: config.line.channelSecret
});

const getUsers = (): string[] => {
  // TODO: get user from somewhere
  return [];
};

bot.onEvent(handler);

export const BotServer = bot;

export const multicastFigures = async (figures: IFigure[]) => {
  const users = getUsers();

  for (let figure of figures) {
    const releaseDate = moment(figure.releaseDate);
    const title = _.truncate(figure.name, { length: 30 });
    const text = _.truncate(
      `${releaseDate.format("YYYY年MM月")}發售\n${figure.price}`,
      { length: 60 }
    );

    const content: TemplateButtons = {
      type: "buttons",
      thumbnailImageUrl: figure.image,
      title,
      text,
      actions: [
        {
          type: "uri",
          label: "Open Browser",
          uri: figure.url
        }
      ]
    };

    const template: TemplateMessage = {
      type: "template",
      altText: text,
      template: content
    };

    await client.multicast(users, template);
  }
};
