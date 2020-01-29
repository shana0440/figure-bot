import { queueScheduler, Observable } from 'rxjs';
import { mergeMap, map, reduce, observeOn, mergeAll } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class FnexCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const host = 'https://fnex.jp';
    return this.request
      .request(`${host}/products/search.php?categories[]=14&page=1`)
      .pipe(
        map(($) => {
          const links = $('.item')
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
          const name = $('.name').text();
          // FIXME: should show not found file image
          const cover = $('#tlarge > div.active > img').attr('src') || '';
          const price = $('.num').text();
          const publishAt = $('#form1 > section:nth-child(6) > div > h4').text();
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
