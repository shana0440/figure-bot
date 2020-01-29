import { queueScheduler, Observable } from 'rxjs';
import { mergeMap, map, mergeAll, observeOn, reduce } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class GoodSmileCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const url = 'https://www.goodsmile.info/zh/products/category/scale/announced';
    return this.request
      .request(url)
      .pipe(
        map(($) => {
          const links = $('.hitBox a:not([target="_blank"])')
            .map((i, it) => $(it).attr('href'))
            .get();
          return links;
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, CheerioStatic]>>((url) =>
          this.request.request(url).pipe(map(($) => [url, $]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('.title').text();
          const cover = 'https:' + $('#itemZoom1 > div:nth-child(1) > a:nth-child(2) > img:nth-child(1)').attr('src');
          const price = $('dd[itemprop=price]')
            .text()
            .replace(/\s/g, '');
          const publishAt = $('dd.release_date').text();
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
