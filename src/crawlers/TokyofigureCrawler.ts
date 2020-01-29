import { queueScheduler, Observable } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class TokyofigureCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const host = 'https://tokyofigure.jp';
    return this.request
      .request(`${host}/products/list.php?category_id=9&orderby=date&disp_number=10&pageno=1`)
      .pipe(
        map(($) => {
          const links = $('.list_area img')
            .map((i, it) => {
              const onclick = $(it).attr('onclick') || '';
              const link = (onclick.match(/jumpDetail\('(.*)'\)/) || []).pop();
              return host + link;
            })
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
          const cover = `${host}` + $('.products_subimg_in:first-child img').attr('src');
          const price = $('.normal_price > dd:nth-child(2)').text();
          const publishAt = $('.sale_date > dd:nth-child(2)').text();
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
