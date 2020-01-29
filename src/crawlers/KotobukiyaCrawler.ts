import { Observable, queueScheduler } from 'rxjs';
import { mergeMap, map, mergeAll, reduce, observeOn } from 'rxjs/operators';

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
        map(($) => {
          const links = $('.product-item')
            .map((i, it) => host + $(it).attr('href'))
            .get();
          return links;
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, CheerioStatic]>>((url) =>
          this.request.request(url).pipe(map(($) => [url, $]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
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
        }),
        reduce<Figure, Figure[]>((acc, it) => [...acc, it], [])
      )
      .toPromise();
  }
}
