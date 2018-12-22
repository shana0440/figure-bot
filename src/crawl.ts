import { Handler } from "aws-lambda";
import * as Bot from "./Bot";
import Crawler from "./crawlers/Crawler";
import GoodSmileCrawler from "./crawlers/GoodSmileCrawler";
import AlterCrawler from "./crawlers/AlterCrawler";
import KotobukiyaCrawler from "./crawlers/KotobukiyaCrawler";
import TokyofigureCrawler from "./crawlers/TokyofigureCrawler";
import FnexCrawler from "./crawlers/FnexCrawler";
import AoshimaCrawler from "./crawlers/AoshimaCrawler";
import AlphamaxCrawler from "./crawlers/AlphamaxCrawler";
import PulchraCrawler from "./crawlers/PulchraCrawler";
import { leaveUnsavedURL, saveFigures } from "./repository/figure";

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
    for (let crawler of this.crawlers) {
      const urls: string[] = await crawler.getFiguresURL();
      const unsavedURLs = await leaveUnsavedURL(urls);
      const figures = await Promise.all(unsavedURLs.map(crawler.getFigure));
      await saveFigures(figures);
      // await Bot.multicastFigures(figures);
    }
  }
}

export const handler: Handler = async () => {
  try {
    // TODO: start another lambda to parse figure
    const crawl = new CrawlFlow();
    await crawl.start();
    process.exit();
  } catch (err) {
    // TODO handler error
    console.error(err);
    process.exit();
  }
};
