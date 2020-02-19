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
            url: 'https://www.aniplexplus.com/itemChCRrJqq',
            name: '1/8スケールフィギュア　Fate/EXTRA CCC「キャスター」',
            cover: 'https://www.aniplexplus.com/res/Q0xAGv?w=510&h=510',
            price: '￥15,840（税込）',
            publishAt: '2017年4月 発売予定',
          },
          {
            url: 'https://www.aniplexplus.com/itemWkMOjdyq',
            name: '遠坂リン(戦闘時) 1/7スケールフィギュア',
            cover: 'https://www.aniplexplus.com/res/ncclbw?w=510&h=510',
            price: '￥17,380（税込）',
            publishAt: '2020年4月 お届け予定',
          },
          {
            cover: 'https://www.aniplexplus.com/res/kKcaLU?w=510&h=510',
            name: '「Fate/stay night」 ～15th Celebration Project～ 15th Celebration Dress ver. 1/7スケールフィギュア',
            price: '￥45,000（税込）￥14,500（税込）￥13,800（税込）￥13,800（税込）',
            publishAt: '2021年6月 発売予定',
            url: 'https://www.aniplexplus.com/itemTKdIzPT',
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
            url: 'https://www.aniplexplus.com/itemChCRrJqq',
            name: '1/8スケールフィギュア　Fate/EXTRA CCC「キャスター」',
            cover: 'https://www.aniplexplus.com/res/Q0xAGv?w=510&h=510',
            price: '￥15,840（税込）',
            publishAt: '2017年4月 発売予定',
          },
          {
            url: 'https://www.aniplexplus.com/itemWkMOjdyq',
            name: '遠坂リン(戦闘時) 1/7スケールフィギュア',
            cover: 'https://www.aniplexplus.com/res/ncclbw?w=510&h=510',
            price: '￥17,380（税込）',
            publishAt: '2020年4月 お届け予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
