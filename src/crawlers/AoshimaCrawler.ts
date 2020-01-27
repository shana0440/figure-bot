import { forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class AoshimaCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    return this.request
      .request('http://www.aoshima-bk.co.jp/product/?s=&brand=&category=フィギュア')
      .pipe(
        mergeMap(($) => {
          const links = $('.item-list > li > a:nth-child(1)')
            .map((i, it) => $(it).attr('href'))
            .get();
          return forkJoin(links.map((it) => this.request.request(it).pipe(map((x) => [it, x]))));
        }),
        map(($figures) => {
          return $figures.map(([url, $]) => {
            const name = $('.mainContents > h1:nth-child(2)').text();
            const cover = $('.img > img:nth-child(1)').attr('src');
            const price = $('.itemData > dl:nth-child(2) > dd:nth-child(10)').text();
            const publishAt = $('.itemData > dl:nth-child(2) > dd:nth-child(8)')
              .text()
              .trim();
            const figure: Figure = {
              url,
              name,
              cover,
              price,
              publishAt,
            };
            return figure;
          });
        })
      )
      .toPromise();
  }
}
