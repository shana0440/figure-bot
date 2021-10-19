import 'mocha';
import { expect } from 'chai';

import { AniplexPlusCrawler } from '../../../crawlers/AniplexPlusCrawler';
import { AniplexPlusMockRequest } from './AniplexPlusMockRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('AniplexPlusCrawler', () => {
  it('fetch figures', (done) => {
    const request = new AniplexPlusMockRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new AniplexPlusCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://www.aniplexplus.com/itemChCRrJqq.html',
            name: '1/8スケールフィギュア　Fate/EXTRA CCC「キャスター」',
            cover:
              'https://www.aniplexplus.com/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwdceb12b9/items/items1000/1709/contents/5820.jpg',
            price: '¥15,840',
            publishAt: '2017年4月お届け予定',
          },
          {
            url: 'https://www.aniplexplus.com/itemWkMOjdyq.html',
            name: '遠坂リン(戦闘時) 1/7スケールフィギュア',
            cover:
              'https://www.aniplexplus.com/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw61c53825/items/items4000/4195/contents/14710.png',
            price: '¥17,380',
            publishAt: '2020年6月13日よりお届け予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new AniplexPlusMockRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        cover: 'https://www.aniplexplus.com/res/kKcaLU?w=510&h=510',
        name: '「Fate/stay night」 ～15th Celebration Project～ 15th Celebration Dress ver. 1/7スケールフィギュア',
        price: '￥45,000（税込）￥14,500（税込）￥13,800（税込）￥13,800（税込）',
        publishAt: '2021年6月 発売予定',
        url: 'https://www.aniplexplus.com/itemTKdIzPT',
      },
    ]);
    const crawler = new AniplexPlusCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://www.aniplexplus.com/itemChCRrJqq.html',
            name: '1/8スケールフィギュア　Fate/EXTRA CCC「キャスター」',
            cover:
              'https://www.aniplexplus.com/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwdceb12b9/items/items1000/1709/contents/5820.jpg',
            price: '¥15,840',
            publishAt: '2017年4月お届け予定',
          },
          {
            url: 'https://www.aniplexplus.com/itemWkMOjdyq.html',
            name: '遠坂リン(戦闘時) 1/7スケールフィギュア',
            cover:
              'https://www.aniplexplus.com/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw61c53825/items/items4000/4195/contents/14710.png',
            price: '¥17,380',
            publishAt: '2020年6月13日よりお届け予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
