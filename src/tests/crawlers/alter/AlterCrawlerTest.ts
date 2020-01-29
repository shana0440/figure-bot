import 'mocha';
import { expect } from 'chai';

import { AlterCrawler } from '../../../crawlers/AlterCrawler';
import { AlterMockHTMLRequest } from './AlterMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('AlterCrawler', () => {
  it('fetch figures will return all figure last 2 years', (done) => {
    const request = new AlterMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new AlterCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://alter-web.jp/products/262/',
            name: '春日野 穹　Ending Ver.',
            cover: 'https://alter-web.jp/uploads/products/20191218185049_wH0FzkIo.jpg',
            price: '20,800円+税',
            publishAt: '2020年12月発売',
          },
          {
            url: 'https://alter-web.jp/products/261/',
            name: 'アルターエゴ／メルトリリス',
            cover: 'https://alter-web.jp/uploads/products/20191218134315_XoqapiVN.jpg',
            price: '24,800円+税',
            publishAt: '2020年11月発売',
          },
          {
            url: 'https://alter-web.jp/products/264/',
            name: 'プリンツ・オイゲン',
            cover: 'https://alter-web.jp/uploads/products/20200114115702_lJNABHEt.jpg',
            price: '37,800円+税',
            publishAt: '2021年4月発売',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new AlterMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        url: 'https://alter-web.jp/products/262/',
        name: '春日野 穹　Ending Ver.',
        cover: 'https://alter-web.jp/uploads/products/20191218185049_wH0FzkIo.jpg',
        price: '20,800円+税',
        publishAt: '2020年12月発売',
      },
    ]);
    const crawler = new AlterCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).deep.equals([
          {
            url: 'https://alter-web.jp/products/261/',
            name: '春日野 穹　Ending Ver.',
            cover: 'https://alter-web.jp/uploads/products/20191218185049_wH0FzkIo.jpg',
            price: '20,800円+税',
            publishAt: '2020年12月発売',
          },
          {
            url: 'https://alter-web.jp/products/264/',
            name: 'アルターエゴ／メルトリリス',
            cover: 'https://alter-web.jp/uploads/products/20191218134315_XoqapiVN.jpg',
            price: '24,800円+税',
            publishAt: '2020年11月発売',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
