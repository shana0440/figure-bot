import * as mongoose from 'mongoose';
import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";
import { Figure } from "./Figure";
import { Model } from 'mongoose';
import { uploadByURL } from './Storage';
import * as Bot from './Bot';

(async () => {
    try {
        let crawler = new GoodSmileCrawler();
        const figures = await crawler.getFigures();
        const needMulticastFigures = await Figure.notInDB(figures);
        for (let figure of needMulticastFigures) {
            figure.image = await uploadByURL(figure.image);
        }
        await Figure.insertMany(needMulticastFigures);
        console.log(needMulticastFigures);
        await Bot.multicastFigures(needMulticastFigures);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit();
    }
})();