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
      .request(`${host}/products/list.php?category_id=9&disp_number=148&pageno=1wovn=ja`)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.productlist_l > a')
            .map((i, it) => {
              const link = $(it).attr('href') || '';
              return host + link;
            })
            .get();

          console.info(`${this.name}: fetch ${links.length} figures.`);
          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
          this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('.name:first').text();
          const cover = `${host}` + $('.ad-thumb-list img:first').attr('src');
          const price = $('.sale_price_value')
            .text()
            .replace(/\n|\s/g, '');
          const publishAt = $('.sale_date > dd')
            .text()
            .replace(/\n|\s/g, '');
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
