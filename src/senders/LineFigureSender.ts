import { Client, FlexMessage, FlexBubble, WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';

import { Config } from '../config/Config';
import { Figure } from '../models/Figure';
import { FigureSender } from './FigureSender';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticationError } from '../errors/AuthenticationError';

const TYPE = 'line';

export class LineFigureSender implements FigureSender {
  private client: Client;
  private userRepo: UserRepository;

  constructor(config: Config, userRepo: UserRepository) {
    this.client = new Client({
      channelAccessToken: config.lineAccessToken,
      channelSecret: config.lineChannelSecret,
    });
    this.userRepo = userRepo;
  }

  async handleRequestBody(json: WebhookRequestBody) {
    await Promise.all(json.events.map((it) => this.handleEvent(it)));
  }

  private async handleEvent(event: WebhookEvent) {
    const userId = event.source.userId;

    if (userId === undefined) {
      throw new AuthenticationError('user id should not be undefined');
    }

    const user = {
      type: TYPE,
      id: userId,
    };
    switch (event.type) {
      case 'follow':
        return await this.userRepo.save(user);
      case 'unfollow':
        return await this.userRepo.delete(user);
    }
  }

  async send(figures: Figure[]) {
    const userIds = this.userRepo.list(TYPE).map((it) => it.id);
    await Promise.all(
      figures.map<FlexMessage>(generateFlexMessage).map(async (msg) => {
        await this.client.multicast(userIds, msg);
      })
    );
  }
}

function generateFlexMessage(figure: Figure): FlexMessage {
  const body: FlexBubble = {
    type: 'bubble',
    hero: {
      type: 'image',
      url: figure.cover,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'fit',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: figure.name,
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'lg',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: figure.price,
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: figure.publishAt,
                  color: '#666666',
                  size: 'sm',
                  flex: 1,
                  align: 'end',
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'link',
          height: 'sm',
          action: {
            type: 'uri',
            label: 'Open',
            uri: figure.url,
          },
        },
      ],
      flex: 0,
    },
  };
  return {
    type: 'flex',
    altText: figure.name,
    contents: body,
  };
}
