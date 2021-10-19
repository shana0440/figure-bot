import * as Sentry from '@sentry/node';

import { config } from './config/Config';
import { Container } from './Container';
import { Figure } from './models/Figure';
import { figureSchema } from './schemas/figureSchema';

const container = new Container(config);

const crawlers = [
  container.alphamaxCrawler,
  container.alterCrawler,
  container.aoshimaCrawler,
  container.fnexCrawler,
  container.goodsmileCrawler,
  container.kotobukiyaCrawler,
  container.tokyofigureCrawler,
  container.broccoliCrawler,
  container.hobbyjapanCrawler,
  container.hakomusuCrawler,
  container.aniplexplusCrawler,
];

const lineSender = container.lineFigureSender;
const figureRepo = container.figureRepository;

Sentry.init({ dsn: config.sentryDSN });

async function main() {
  for (const it of crawlers) {
    console.info(`${it.name}: start fetching`);
    const figures = await it.fetchFigures();
    const nonSavedFigures = figureRepo.filterSavedFigures(figures);
    const [valid, invalid] = nonSavedFigures.reduce<[Figure[], Figure[]]>(
      ([valid, invalid], it) => {
        if (figureSchema.isValidSync(it)) {
          valid = [...valid, it];
        } else {
          invalid = [...invalid, it];
        }
        return [valid, invalid];
      },
      [[], []]
    );
    const chunks = valid.reduce<Figure[][]>(
      (acc, it) => {
        if (acc[acc.length - 1].length > 10) {
          acc = [...acc, []];
        }
        acc[acc.length - 1] = [...acc[acc.length - 1], it];
        return acc;
      },
      [[]]
    );
    for (const chunk of chunks) {
      await lineSender.send(chunk);
      figureRepo.save(chunk);
    }
    if (invalid.length) {
      Sentry.captureMessage(JSON.stringify(invalid));
    }
    console.info(`${it.name}: saved ${valid.length} figures.`);
  }
}

main().catch((err) => {
  console.error(err);
  Sentry.captureException(err);
});
