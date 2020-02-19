import * as Sentry from '@sentry/node';

import { config } from './config/Config';
import { Container } from './Container';
import { Figure } from './models/Figure';

const container = new Container(config);

const crawlers = [
  container.alphamaxCrawler,
  container.alterCrawler,
  container.aoshimaCrawler,
  container.fnexCrawler,
  container.goodsmileCrawler,
  container.kotobukiyaCrawler,
  container.pulchraCrawler,
  container.tokyofigureCrawler,
  container.broccoliCrawler,
  container.hobbyjapanCrawler,
  container.hakomusuCrawler,
  container.aniplexplusCrawler,
];

const lineSender = container.lineFigureSender;
const figureRepo = container.figureRepository;

Sentry.init({ dsn: config.sentryDSN });

console.log('start fetch');
Promise.all(
  crawlers.map(async (it) => {
    const figures = await it.fetchFigures();
    const nonSavedFigures = figureRepo.filterSavedFigures(figures);
    console.log(nonSavedFigures);
    const chunks = nonSavedFigures.reduce<Figure[][]>(
      (acc, it) => {
        if (acc[acc.length - 1].length > 10) {
          acc = [...acc, []];
        }
        acc[acc.length - 1] = [...acc[acc.length - 1], it];
        return acc;
      },
      [[]]
    );
    for (let chunk of chunks) {
      await lineSender.send(chunk);
      figureRepo.save(chunk);
    }
  })
)
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.error(err);
    Sentry.captureException(err);
  });
