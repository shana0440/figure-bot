import { HakomusuCrawler } from '../../../crawlers/HakomusuCrawler';
import { HakomusuMockHTMLRequest } from './HakomusuMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('HakomusuCrawler', () => {
  it('fetch figures', (done) => {
    const request = new HakomusuMockHTMLRequest();
    const crawler = new HakomusuCrawler(request, new MockFigureRepoitory());
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'https://www.hakomusu.jp/figure18.html',
            name: '時崎 狂三',
            cover: 'https://www.hakomusu.jp/assets/img/figure1800.jpg',
            price: '16,800円（税別）',
            publishAt: '2020年２月予定',
          },
          {
            url: 'https://www.hakomusu.jp/figure01.html',
            name: 'アレイン',
            cover: 'https://www.hakomusu.jp/assets/img/figure0100.jpg',
            price: '14,000円（税別）',
            publishAt: '2015年8月',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new HakomusuMockHTMLRequest();
    const crawler = new HakomusuCrawler(
      request,
      new MockFigureRepoitory([
        {
          url: 'https://www.hakomusu.jp/figure01.html',
          name: 'アレイン',
          cover: 'https://www.hakomusu.jp/assets/img/figure0100.jpg',
          price: '14,000円（税別）',
          publishAt: '2015年8月',
        },
      ])
    );
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'https://www.hakomusu.jp/figure18.html',
            name: '時崎 狂三',
            cover: 'https://www.hakomusu.jp/assets/img/figure1800.jpg',
            price: '16,800円（税別）',
            publishAt: '2020年２月予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
