import { GoodSmileCrawler } from '../../../crawlers/GoodSmileCrawler';
import { GoodSmileMockHTMLRequest } from './GoodSmileMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('GoodSmileCrawler', () => {
  it('fetch figures', (done) => {
    const request = new GoodSmileMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new GoodSmileCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'https://www.goodsmile.info/zh/product/9210/%E7%BE%8E%E9%81%8A+%E8%89%BE%E8%92%82%E8%8F%B2%E7%88%BE%E7%89%B9+Prisma+Klangfest+Ver.html',
            name: '美遊·艾蒂菲爾特 Prisma☆Klangfest Ver.',
            cover:
              'https://images.goodsmile.info/cgm/images/product/20200124/9210/67099/large/8f65098c90df46442a70883386ef0198.jpg',
            price: '14,800日圓+消費稅',
            publishAt: '2020/09',
          },
          {
            url: 'https://www.goodsmile.info/zh/product/9190/POP+UP+PARADE+%E5%B7%A7%E5%85%8B%E5%8A%9B.html',
            name: 'POP UP PARADE 巧克力',
            cover:
              'https://images.goodsmile.info/cgm/images/product/20200121/9190/67001/large/f14094842a7b3526fd508b5b4b6178af.jpg',
            price: '3,545日圓+消費稅',
            publishAt: '2020/05',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new GoodSmileMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        url: 'https://www.goodsmile.info/zh/product/9190/POP+UP+PARADE+%E5%B7%A7%E5%85%8B%E5%8A%9B.html',
        name: 'POP UP PARADE 巧克力',
        cover:
          'https://images.goodsmile.info/cgm/images/product/20200121/9190/67001/large/f14094842a7b3526fd508b5b4b6178af.jpg',
        price: '3,545日圓+消費稅',
        publishAt: '2020/05',
      },
    ]);
    const crawler = new GoodSmileCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'https://www.goodsmile.info/zh/product/9210/%E7%BE%8E%E9%81%8A+%E8%89%BE%E8%92%82%E8%8F%B2%E7%88%BE%E7%89%B9+Prisma+Klangfest+Ver.html',
            name: '美遊·艾蒂菲爾特 Prisma☆Klangfest Ver.',
            cover:
              'https://images.goodsmile.info/cgm/images/product/20200124/9210/67099/large/8f65098c90df46442a70883386ef0198.jpg',
            price: '14,800日圓+消費稅',
            publishAt: '2020/09',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
