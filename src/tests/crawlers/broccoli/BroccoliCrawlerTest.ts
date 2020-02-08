import 'mocha';
import { expect } from 'chai';

import { BroccoliCrawler } from '../../../crawlers/BroccoliCrawler';
import { BroccoliMockHTMLRequest } from './BroccoliMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('BroccoliCrawler', () => {
  it('fetch figures', (done) => {
    const request = new BroccoliMockHTMLRequest();
    const crawler = new BroccoliCrawler(request, new MockFigureRepoitory());
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://www.broccoli.co.jp/hobby/figure47-zx_azumi/',
            name:
              'Z/X -Zillions of enemy X-「各務原 あづみ」1/7スケールフィギュア Z/X -Zillions of enemy X- 「各務原 あづみ」',
            cover: 'https://www.broccoli.co.jp/resource/data/figure/figure47-zx_azumi/gallery/02.jpg',
            price: '19,000円＋税',
            publishAt: '2020年7月予定',
          },
          {
            url: 'https://www.broccoli.co.jp/hobby/figure42-ga_mint/',
            name: 'ギャラクシーエンジェル「ミント・ブラマンシュ」',
            cover: 'https://www.broccoli.co.jp/resource/data/figure/figure42-ga_mint/gallery/01.jpg',
            price: '14,000円＋税15,500円＋税（通常版：14,000円＋税）  ',
            publishAt: '2019年11月29日(金)',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new BroccoliMockHTMLRequest();
    const crawler = new BroccoliCrawler(
      request,
      new MockFigureRepoitory([
        {
          url: 'https://www.broccoli.co.jp/hobby/figure42-ga_mint/',
          name: 'ギャラクシーエンジェル「ミント・ブラマンシュ」',
          cover: 'https://www.broccoli.co.jp/resource/data/figure/figure42-ga_mint/gallery/01.jpg',
          price: '14,000円＋税15,500円＋税（通常版：14,000円＋税）  ',
          publishAt: '2019年11月29日(金)',
        },
      ])
    );
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://www.broccoli.co.jp/hobby/figure47-zx_azumi/',
            name:
              'Z/X -Zillions of enemy X-「各務原 あづみ」1/7スケールフィギュア Z/X -Zillions of enemy X- 「各務原 あづみ」',
            cover: 'https://www.broccoli.co.jp/resource/data/figure/figure47-zx_azumi/gallery/02.jpg',
            price: '19,000円＋税',
            publishAt: '2020年7月予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
