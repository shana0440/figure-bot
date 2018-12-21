import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";
import { Figure } from "./Figure";
import { uploadFiguresImage } from "./Storage";
import * as Bot from "./Bot";
import { Crawler } from "./crawlers/Crawler";
import { AlterCrawler } from "./crawlers/AlterCrawler";
import { KotobukiyaCrawler } from "./crawlers/KotobukiyaCrawler";
import { TokyofigureCrawler } from "./crawlers/TokyofigureCrawler";
import { FnexCrawler } from "./crawlers/FnexCrawler";
import { AoshimaCrawler } from "./crawlers/AoshimaCrawler";
import { AlphamaxCrawler } from "./crawlers/AlphamaxCrawler";
import { PulchraCrawler } from "./crawlers/PulchraCrawler";

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
    this.crawlers.push(new PulchraCrawler());
  }

  async start() {
    console.time("parse figures spend");
    let parsedFiguresCount = 0;
    for (let crawler of this.crawlers) {
      console.log(crawler.constructor.name, "crawler figure urls");
      const urls: string[] = await crawler.getFiguresURL();
      console.log(crawler.constructor.name, "get unparse urls");
      const unParseURLs = await Figure.getUnparsed(urls);
      console.log(crawler.constructor.name, "get figure url");
      let figures = await crawler.getFigures(unParseURLs);
      console.log(crawler.constructor.name, "get unsave url");
      figures = await Figure.getUnsaved(figures);
      console.log(crawler.constructor.name, "upload image");
      figures = await uploadFiguresImage(figures);
      console.log(crawler.constructor.name, "multicast");
      await Bot.multicastFigures(figures);
      await Figure.insertMany(figures);
      console.log(crawler.constructor.name, "end");
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
