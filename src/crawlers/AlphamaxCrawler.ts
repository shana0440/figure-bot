import { of, queueScheduler } from 'rxjs';
import { mergeMap, map, catchError, mergeAll, reduce, filter, observeOn } from 'rxjs/operators';

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
        map(($) => {
          const links = $('.product-link')
            .map((i, it) => host + $(it).attr('href'))
            .get();
          return links;
        }),
        mergeAll<string>(),
        mergeMap((url) => this.request.request(url)),
        observeOn(queueScheduler),
        map(($) => {
          const url = host + ($('#mobile-version').attr('href') || '').slice(0, -4);
          const name = $('.info-title').text();
          const cover = host + $('.main-image > img').attr('src');
          const price = $('td:contains("価格")')
            .next()
            .text();
          const publishAt = $('td:contains("発売日")')
            .next()
            .text();
          const figure: Figure = {
            url,
            name,
            cover,
            price,
            publishAt,
          };
          return figure;
        }),
        catchError((err) => {
          // FIXME: record error
          console.error(err);
          return of(null);
        }),
        filter((it): it is Figure => it != null),
        reduce<Figure, Figure[]>((acc, it) => [...acc, it], [])
      )
      .toPromise();
  }
}
