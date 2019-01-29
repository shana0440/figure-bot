import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as _ from "lodash";
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
import { setupChrome } from "./utils/chrome";
import Sentry, { sentryLambdaWrapper } from "./utils/sentry";
import { Severity } from "@sentry/node";

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

export const handler: Handler = sentryLambdaWrapper(async () => {
  const invoke = Object.keys(crawlers).map(crawler => {
    return invokeLambda(getFunctionName("CrawlPage"), {
      crawler
    });
  });
  return await Promise.all(invoke);
});

export const handlePage: Handler = sentryLambdaWrapper(
  async (event: CrawlPageEvent) => {
    await setupChrome();
    const crawler: Crawler = crawlers[event.crawler];
    // dynamodb don't allow get duplicate key
    const urls: string[] = _.uniq(await crawler.getFiguresURL());
    const unsavedURLs = await leaveUnsavedURL(urls);
    const invoke = unsavedURLs.map(url => {
      return invokeLambda(getFunctionName("CrawlFigure"), {
        crawler: event.crawler,
        url
      });
    });
    return await Promise.all(invoke);
  }
);

export const handleFigure: Handler = sentryLambdaWrapper(
  async (event: CrawlFigureEvent) => {
    await setupChrome();
    const crawler: Crawler = crawlers[event.crawler];
    const figure = await crawler.getFigure(event.url);
    const { validated, invalidated } = validateFigure([figure]);
    // TODO: alert invalidated figures
    Sentry.captureEvent({
      message: "Cannot parse those figures",
      level: Severity.Warning,
      contexts: { figures: invalidated }
    });
    await saveFigures(validated);
    return await Bot.multicastFigures(validated);
  }
);
