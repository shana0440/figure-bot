import 'mocha';
import { expect } from 'chai';

import { AlphamaxCrawler } from '../../../crawlers/AlphamaxCrawler';
import { AlphamaxMockHTMLRequest } from './AlphamaxMockHTMLRequest';

const request = new AlphamaxMockHTMLRequest();

describe('AlphamaxCrawler', () => {
  it('fetch figures', (done) => {
    const crawler = new AlphamaxCrawler(request);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://alphamax.jp/ja-JP/Products/detail/ax0226chocola',
            name: 'ショコラ チャイナドレスedition illustration by さより STD Ver.',
            cover: 'https://alphamax.jp/files/01_25.jpg',
            price: '17,800円（税別）',
            publishAt: '2020年9月予定',
          },
          {
            url: 'https://alphamax.jp/ja-JP/Products/detail/ax0227vanilla',
            name: 'バニラ チャイナドレスedition illustration by さより STD Ver.',
            cover: 'https://alphamax.jp/files/01_26.jpg',
            price: '17,800円（税別）',
            publishAt: '2020年9月予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
