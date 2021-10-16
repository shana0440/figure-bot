import { queueScheduler, Observable, of } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn, catchError, filter } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class TokyofigureCrawler implements FigureCrawler {
  name = 'Tokyofigure';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://tokyofigure.jp';
    return this.request
      .request(`${host}/products/list.php?category_id=9&orderby=date&disp_number=10&pageno=1`)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.list_area img')
            .map((i, it) => {
              const onclick = $(it).attr('onclick') || '';
              const link = (onclick.match(/jumpDetail\('(.*)'\)/) || []).pop();
              return host + link;
            })
            .get();

          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
          this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
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
        catchError((err) => {
          Sentry.captureException(err);
          return of(null);
        }),
        filter((it): it is Figure => it != null),
        reduce<Figure, Figure[]>((acc, it) => [...acc, it], [])
      )
      .toPromise();
  }
}
