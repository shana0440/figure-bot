import * as fs from "fs";
import * as _ from "lodash";
import {
  Client,
  TemplateButtons,
  TemplateMessage,
  WebhookEvent
} from "@line/bot-sdk";
import * as moment from "moment";
import { IFigure } from "./models/figure";
import config from "./config";
import { addUser, removeUser, getAllUsers } from "./repository/user";

const client = new Client({
  channelAccessToken: config.line.accessToken,
  channelSecret: config.line.channelSecret
});

const getUsers = async (): Promise<string[]> => {
  const users = await getAllUsers();
  return users.map(user => user.id);
};

export const handleEvent = async (event: WebhookEvent): Promise<void> => {
  switch (event.type) {
    case "follow":
      return await addUser({ id: event.source.userId });
    case "unfollow":
      return await removeUser({ id: event.source.userId });
  }
};

export const multicastFigures = async (figures: IFigure[]) => {
  const users = await getUsers();

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
