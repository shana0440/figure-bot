import { HobbyjapanCrawler } from '../../../crawlers/HobbyjapanCrawler';
import { HobbyjapanMockHTMLRequest } from './HobbyjapanMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('HobbyjapanCrawler', () => {
  it('fetch figures', (done) => {
    const request = new HobbyjapanMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new HobbyjapanCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'https://hobbyjapan.co.jp/ltd_items/hj20200301/',
            name: 'エリザベート＝バートリー渚の鮮血魔嬢',
            cover: 'https://hobbyjapan.co.jp/ltd_items/hj20200301/001.jpg',
            price: '15,980円（税込）＋送手数料別',
            publishAt: '2020年11月～12月発送予定仕様',
          },
          {
            url: 'https://hobbyjapan.co.jp/ltd_items/hj20200201/',
            name: '水泳部のコウハイちゃん',
            cover: 'https://hobbyjapan.co.jp/ltd_items/hj20200201/001.jpg',
            price: '14,980円（税込）＋送手数料別',
            publishAt: '2020年9月～10月発送予定仕様',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new HobbyjapanMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        url: 'https://hobbyjapan.co.jp/ltd_items/hj20200201/',
        name: '水泳部のコウハイちゃん',
        cover: 'https://hobbyjapan.co.jp/ltd_items/hj20200201/001.jpg',
        price: '14,980円（税込）＋送手数料別',
        publishAt: '2020年9月～10月発送予定仕様',
      },
    ]);
    const crawler = new HobbyjapanCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'https://hobbyjapan.co.jp/ltd_items/hj20200301/',
            name: 'エリザベート＝バートリー渚の鮮血魔嬢',
            cover: 'https://hobbyjapan.co.jp/ltd_items/hj20200301/001.jpg',
            price: '15,980円（税込）＋送手数料別',
            publishAt: '2020年11月～12月発送予定仕様',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
