import { LineBot } from 'bottender';
import * as fs from 'fs';
import * as path from 'path';
import { IFigure } from './Figure';
import * as moment from 'moment';

const bot = new LineBot({
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    accessToken: process.env.LINE_ACCESS_TOKEN,
});

const splitText = (text, length) => {
    if (text.length > length) {
        return text.substr(0, length - 3) + '...';
    } else {
        return text;
    }
}

export const multicastFigures = async (figures: IFigure[]) => {
    const users: JSON = JSON.parse(fs.readFileSync(`${__dirname}/usres.json`).toString());
    for (let figure of figures) {
        const releaseDate = moment(figure.release_date);
        const title = splitText(figure.name, 30);
        const text = splitText(`${releaseDate.format('YYYY年MM月')}發售\n${figure.price}`, 60);
        const template = {
            type: 'buttons',
            thumbnailImageUrl: figure.image,
            title: title,
            text: text,
            actions: [{
                type: 'uri',
                label: 'Open Browser',
                uri: figure.url,
            }]
        }
        await bot._connector._client.multicastTemplate(users, title, template);
    }
}