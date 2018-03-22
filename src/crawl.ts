import * as mongoose from 'mongoose';
import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";
import { Figure } from "./Figure";
import { Model } from 'mongoose';
import { uploadFiguresImage } from './Storage';
import * as Bot from './Bot';
import { Crawler } from './crawlers/Crawler';
import { AlterCrawler } from './crawlers/AlterCrawler';
import { KotobukiyaCrawler } from './crawlers/KotobukiyaCrawler';
import { TokyofigureCrawler } from './crawlers/TokyofigureCrawler';
import { FnexCrawler } from './crawlers/FnexCrawler';
import { AoshimaCrawler } from './crawlers/AoshimaCrawler';
import { AlphamaxCrawler } from './crawlers/AlphamaxCrawler';

class CrawlFlow {
    crawlers: Crawler[] = [];
    constructor() {
        this.crawlers.push(new GoodSmileCrawler());
        this.crawlers.push(new AlterCrawler());
        this.crawlers.push(new KotobukiyaCrawler());
        this.crawlers.push(new TokyofigureCrawler());
        this.crawlers.push(new FnexCrawler());
        this.crawlers.push(new AoshimaCrawler());
        this.crawlers.push(new AlphamaxCrawler());
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
