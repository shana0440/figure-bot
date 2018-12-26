import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
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
import { validateFigure } from "./validators/figure";
import { getFunctionName } from "./utils/function";

interface CrawlPageEvent {
  crawler: string;
}

interface CrawlFigureEvent {
  crawler: string;
  url: string;
}

const lambda = new AWS.Lambda();

const crawlers: { [key: string]: Crawler } = {
  GoodSmileCrawler: new GoodSmileCrawler(),
  AlterCrawler: new AlterCrawler(),
  KotobukiyaCrawler: new KotobukiyaCrawler(),
  TokyofigureCrawler: new TokyofigureCrawler(),
  FnexCrawler: new FnexCrawler(),
  AoshimaCrawler: new AoshimaCrawler(),
  AlphamaxCrawler: new AlphamaxCrawler(),
  PulchraCrawler: new PulchraCrawler()
};

const invokeLambda = (
  fn: string,
  payload: CrawlPageEvent | CrawlFigureEvent
) => {
  return lambda
    .invoke({
      FunctionName: fn,
      InvocationType: "Event",
      Payload: JSON.stringify(payload)
    })
    .promise();
};

export const handler: Handler = async () => {
  const invoke = Object.keys(crawlers).map(crawler => {
    return invokeLambda(getFunctionName("CrawlPage"), {
      crawler
    });
  });
  return await Promise.all(invoke);
};

export const handlePage: Handler = async (event: CrawlPageEvent) => {
  const crawler: Crawler = crawlers[event.crawler];
  const urls: string[] = await crawler.getFiguresURL();
  const unsavedURLs = await leaveUnsavedURL(urls);
  const invoke = unsavedURLs.map(url => {
    return invokeLambda(getFunctionName("CrawlFigure"), {
      crawler: event.crawler,
      url
    });
  });
  return await Promise.all(invoke);
};

export const handleFigure: Handler = async (event: CrawlFigureEvent) => {
  const crawler: Crawler = crawlers[event.crawler];
  const figure = await crawler.getFigure(event.url);
  const { validated, invalidated } = validateFigure([figure]);
  // TODO: alert invalidated figures
  await Bot.multicastFigures(validated);
  return await saveFigures(validated);
};
