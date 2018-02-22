import * as mongoose from 'mongoose';
import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";
import { Figure } from "./Figure";
import { Model } from 'mongoose';
import { uploadFiguresImage } from './Storage';
import * as Bot from './Bot';
import { Crawler } from './crawlers/Crawler';

class CrawlFlow {
    crawlers: Crawler[] = [];
    constructor() {
        this.crawlers.push(new GoodSmileCrawler());
    }

    async start() {
        console.time("parse figures spend");
        let parsedFiguresCount = 0;
        for (let crawler of this.crawlers) {
            const urls: string[] = await crawler.getFiguresURL();
            const unParseURLs = await Figure.getUnparsed(urls);
            let figures = await crawler.getFigures(unParseURLs);
            figures = await Figure.getUnsaved(figures);
            figures = await uploadFiguresImage(figures);
            await Bot.multicastFigures(figures);
            await Figure.insertMany(figures);
            parsedFiguresCount += figures.length;
        }
        console.timeEnd("parse figures spend");
        console.log(`parsed ${parsedFiguresCount} figures`);
    }
}

(async () => {
    try {
        const crawl = new CrawlFlow();
        await crawl.start();
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit();
    }
})();
