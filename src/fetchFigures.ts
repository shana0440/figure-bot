import { config } from './config/Config';
import { Container } from './Container';

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
];

const lineSender = container.lineFigureSender;
const figureRepo = container.figureRepository;

console.log('start fetch');
Promise.all(
  crawlers.map(async (it) => {
    const figures = await it.fetchFigures();
    const nonSavedFigures = figureRepo.filterSavedFigures(figures);
    console.log(nonSavedFigures);
    await lineSender.send(nonSavedFigures);
    figureRepo.save(figures);
  })
)
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.error(err);
  });
