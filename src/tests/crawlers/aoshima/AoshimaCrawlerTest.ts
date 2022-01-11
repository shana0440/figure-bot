import { AoshimaCrawler } from '../../../crawlers/AoshimaCrawler';
import { AoshimaMockHTMLRequest } from './AoshimaMockHTMLRequest';
import { MockFigureRepoitory } from '../MockFigureRepository';

describe('AoshimaCrawler', () => {
  it('fetch figures', (done) => {
    const request = new AoshimaMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory();
    const crawler = new AoshimaCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'http://www.aoshima-bk.co.jp/product/4905083106204/',
            name: 'Fate/Grand Order 1/7 謎のヒロインX オルタ',
            cover: 'https://www.aoshima-bk.co.jp/wp/wp-content/uploads/2019/12/4905083106204-500x480.jpg',
            price: '16,800円（税別）',
            publishAt: '2020年3月発売予定',
          },
          {
            url: 'http://www.aoshima-bk.co.jp/product/4905083107188/',
            name: 'Fate/Apocrypha 1/8 ”赤”のアサシン セミラミス（再生産）',
            cover: 'https://www.aoshima-bk.co.jp/wp/wp-content/uploads/2017/07/4905083098875_0-500x480.jpg',
            price: '14,800円（税別）',
            publishAt: '2019年12月発売中',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('only fetch the figures havent saved', (done) => {
    const request = new AoshimaMockHTMLRequest();
    const figureRepo = new MockFigureRepoitory([
      {
        url: 'http://www.aoshima-bk.co.jp/product/4905083107188/',
        name: 'Fate/Apocrypha 1/8 ”赤”のアサシン セミラミス（再生産）',
        cover: 'https://www.aoshima-bk.co.jp/wp/wp-content/uploads/2017/07/4905083098875_0-500x480.jpg',
        price: '14,800円（税別）',
        publishAt: '2019年12月発売中',
      },
    ]);
    const crawler = new AoshimaCrawler(request, figureRepo);
    crawler
      .fetchFigures()
      .then((figures) => {
        expect(figures).toStrictEqual([
          {
            url: 'http://www.aoshima-bk.co.jp/product/4905083106204/',
            name: 'Fate/Grand Order 1/7 謎のヒロインX オルタ',
            cover: 'https://www.aoshima-bk.co.jp/wp/wp-content/uploads/2019/12/4905083106204-500x480.jpg',
            price: '16,800円（税別）',
            publishAt: '2020年3月発売予定',
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });
});
