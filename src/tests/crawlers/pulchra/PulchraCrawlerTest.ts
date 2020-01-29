import 'mocha';
import { expect } from 'chai';

import { PulchraCrawler } from '../../../crawlers/PulchraCrawler';
import { PulcharMockHTMLRequest } from './PulcharMockHTMLRequest';

const request = new PulcharMockHTMLRequest();

describe('PulchraCrawler', () => {
  it('fetch figures', (done) => {
    const crawler = new PulchraCrawler(request);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://pulc.jp/category/select/cid/312/pid/8963',
            name: '「ミライアカリ」レーシングver 1/7スケール 塗装済み完成品フィギュア',
            cover: 'https://pulc.jp/resources/upload/products/thumbnail2/20190712_miraiakari_shiro_shop.jpg',
            price: '17,064円',
            publishAt: '2019年12月末発売予定',
          },
          {
            url: 'https://pulc.jp/category/select/cid/312/pid/8962',
            name: 'まいてつ「ハチロク」水着ver 1/6スケール　塗装済み完成品フィギュア',
            cover: 'https://pulc.jp/resources/upload/products/thumbnail2/20190710_hatiroku_shiro_shop.jpg',
            price: '14,904円',
            publishAt: '2019年12月末発売予定',
          },
          {
            url: 'https://pulc.jp/category/select/cid/312/pid/8961',
            name: '盾の勇者の成り上がり「ラフタリア&フィーロ（フィロリアルver.）」',
            cover: 'https://pulc.jp/resources/upload/products/thumbnail2/190617_rahu_firo%20_shop_shiro.jpg',
            price: '17,280円',
            publishAt: '2019年12月末発売予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
