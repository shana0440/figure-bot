import 'mocha';
import { expect } from 'chai';

import { FnexCrawler } from '../../../crawlers/FnexCrawler';
import { FnexMockHTMLRequest } from './FnexMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('FnexCrawler', () => {
  it('fetch figures', (done) => {
    const request = new FnexMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new FnexCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://fnex.jp/products/detail.php?product_id=52',
            name: 'やはり俺の青春ラブコメはまちがっている。完 雪ノ下雪乃 -白無垢- 1/7スケールフィギュア',
            cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx165_01.jpg',
            price: '¥17,800（税抜）',
            publishAt: '2020年9月 お届け予定',
          },
          {
            url: 'https://fnex.jp/products/detail.php?product_id=51',
            name: '〈物語〉シリーズ 忍野忍 1/2スケール PVC製フィギュア',
            cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx164_01.jpg',
            price: '¥174,000（税抜）',
            publishAt: '2020年9月 お届け予定',
          },
          {
            url: 'https://fnex.jp/products/detail.php?product_id=53',
            name: 'Shadowverse【シャドウバース】 ルナ 1/7スケールフィギュア',
            cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx167_01.jpg',
            price: '¥18,800（税抜）',
            publishAt: '2020年7月 お届け予定',
          },
          {
            url: 'https://fnex.jp/products/detail.php?product_id=54',
            name: '俺を好きなのはお前だけかよ パンジー／三色院菫子 1/7スケールフィギュア',
            cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx168_01.jpg',
            price: '¥14,300（税抜）',
            publishAt: '2020年8月 お届け予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new FnexMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        url: 'https://fnex.jp/products/detail.php?product_id=53',
        name: 'Shadowverse【シャドウバース】 ルナ 1/7スケールフィギュア',
        cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx167_01.jpg',
        price: '¥18,800（税抜）',
        publishAt: '2020年7月 お届け予定',
      },
      {
        url: 'https://fnex.jp/products/detail.php?product_id=54',
        name: '俺を好きなのはお前だけかよ パンジー／三色院菫子 1/7スケールフィギュア',
        cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx168_01.jpg',
        price: '¥14,300（税抜）',
        publishAt: '2020年8月 お届け予定',
      },
    ]);
    const crawler = new FnexCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://fnex.jp/products/detail.php?product_id=52',
            name: 'やはり俺の青春ラブコメはまちがっている。完 雪ノ下雪乃 -白無垢- 1/7スケールフィギュア',
            cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx165_01.jpg',
            price: '¥17,800（税抜）',
            publishAt: '2020年9月 お届け予定',
          },
          {
            url: 'https://fnex.jp/products/detail.php?product_id=51',
            name: '〈物語〉シリーズ 忍野忍 1/2スケール PVC製フィギュア',
            cover: 'https://df73htivstjso.cloudfront.net/upload/save_image/fnx164_01.jpg',
            price: '¥174,000（税抜）',
            publishAt: '2020年9月 お届け予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
