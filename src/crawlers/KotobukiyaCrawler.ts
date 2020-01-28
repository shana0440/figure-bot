import { forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class KotobukiyaCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const host = 'https://www.kotobukiya.co.jp';
    return this.request
      .request(`${host}/product-category/figure/`)
      .pipe(
        mergeMap(($) => {
          const links = $('.product-item')
            .map((i, it) => host + $(it).attr('href'))
            .get();

          return forkJoin(links.map((it) => this.request.request(it).pipe(map((x) => [it, x]))));
        }),
        map(($figures) => {
          return $figures.map(([url, $]) => {
            const name = $('.product-title h1').text();
            const cover = host + $('.product-main img').attr('src');
            const price = $('.product-data dl dd:nth-child(12)').text();
            const publishAt = $('.product-data dl dd:nth-child(6)').text();
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
