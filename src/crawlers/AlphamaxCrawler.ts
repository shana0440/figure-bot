import { forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class AlphamaxCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const host = 'https://alphamax.jp';
    return this.request
      .request(`${host}/ja-JP/Categories/index/figure`)
      .pipe(
        mergeMap(($) => {
          const links = $('.product-link')
            .map((i, it) => $(it).attr('href'))
            .get();
          return forkJoin(links.map((it) => this.request.request(it)));
        }),
        map(($figures) => {
          return $figures.map(($) => {
            const url = host + ($('#mobile-version').attr('href') || '').slice(0, -4);
            const name = $('.info-title').text();
            const cover = host + $('.main-image > img').attr('src');
            const price = $(
              '.info-container > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(2)'
            ).text();
            const publishAt = $(
              '.info-container > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)'
            ).text();
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
