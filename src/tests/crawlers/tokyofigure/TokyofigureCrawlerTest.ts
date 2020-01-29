import 'mocha';
import { expect } from 'chai';

import { TokyofigureCrawler } from '../../../crawlers/TokyofigureCrawler';
import { TokyofigureMockHTMLRequest } from './TokyofigureMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('TokyofigureCrawler', () => {
  it('fetch figures', (done) => {
    const request = new TokyofigureMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new TokyofigureCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://tokyofigure.jp/products/detail.php?product_id=134',
            name: 'アヴェンジャー/ジャンヌ・ダルク[オルタ] 昏き焔を纏いし竜の魔女',
            cover: 'https://tokyofigure.jp/upload/save_image/01152005_5e1ef1f142133.jpg',
            price: '34,650円',
            publishAt: '2021年01月 未定',
          },
          {
            url: 'https://tokyofigure.jp/products/detail.php?product_id=133',
            name: 'バニラ  レースクイーン ver.',
            cover: 'https://tokyofigure.jp/upload/save_image/01151951_5e1eeeba293b4.jpg',
            price: '15,950円',
            publishAt: '2020年08月 未定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new TokyofigureMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        url: 'https://tokyofigure.jp/products/detail.php?product_id=133',
        name: 'バニラ  レースクイーン ver.',
        cover: 'https://tokyofigure.jp/upload/save_image/01151951_5e1eeeba293b4.jpg',
        price: '15,950円',
        publishAt: '2020年08月 未定',
      },
    ]);
    const crawler = new TokyofigureCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://tokyofigure.jp/products/detail.php?product_id=134',
            name: 'アヴェンジャー/ジャンヌ・ダルク[オルタ] 昏き焔を纏いし竜の魔女',
            cover: 'https://tokyofigure.jp/upload/save_image/01152005_5e1ef1f142133.jpg',
            price: '34,650円',
            publishAt: '2021年01月 未定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
