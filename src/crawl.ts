import * as mongoose from 'mongoose';
import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";
import { Figure } from "./Figure";
import { Model } from 'mongoose';
import { uploadByURL } from './Storage';

(async () => {
    try {
        let crawler = new GoodSmileCrawler();
        const figures = await crawler.getFigures();
        const needPublishFigures = await Figure.notInDB(figures);
        for (let figure of needPublishFigures) {
            figure.image = await uploadByURL(figure.image);
        }
        await Figure.insertMany(needPublishFigures);
        console.log(needPublishFigures);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit();
    }
})();