import * as mongoose from 'mongoose';
import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";
import { Figure } from "./Figure";
import { Model } from 'mongoose';

(async () => {
    const year = new Date().getFullYear();
    const url = `http://www.goodsmile.info/zh/products/category/scale/announced/${year}`;
    let crawler = new GoodSmileCrawler(url);

    const figures = await crawler.getFigures();
    const needPublishFigures = await Figure.notInDB(figures);
    await Figure.insertMany(needPublishFigures);
    console.log(needPublishFigures);
    process.exit();
})();