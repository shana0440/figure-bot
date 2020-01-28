import 'mocha';
import { expect } from 'chai';

import { KotobukiyaCrawler } from '../../../crawlers/KotobukiyaCrawler';
import { KotobukiyaMockHTMLRequest } from './KotobukiyaMockHTMLRequest';

const request = new KotobukiyaMockHTMLRequest();

describe('KotobukiyaCrawler', () => {
  it('fetch figures', (done) => {
    const crawler = new KotobukiyaCrawler(request);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://www.kotobukiya.co.jp/product/product-0000003566/',
            name: 'ジェネ（ステラメモリーズVer.）',
            cover:
              'https://www.kotobukiya.co.jp/wp-content/uploads/2019/11/51c19e88a249a551b153c60282a1cca14a4264bd.jpg',
            price: '15,000円（税抜）',
            publishAt: '2020年05月',
          },
          {
            url: 'https://www.kotobukiya.co.jp/product/product-0000003577/',
            name: '惣流・アスカ・ラングレー ～ゴスロリver.～：RE',
            cover:
              'https://www.kotobukiya.co.jp/wp-content/uploads/2019/12/3d65ebe48cac800846573bd2b421ae578ad2380b.jpg',
            price: '12,800円（税抜）',
            publishAt: '2020年05月',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
