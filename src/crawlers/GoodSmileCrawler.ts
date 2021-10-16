import { queueScheduler, Observable, of } from 'rxjs';
import { mergeMap, map, mergeAll, observeOn, reduce, filter, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class GoodSmileCrawler implements FigureCrawler {
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const url = 'https://www.goodsmile.info/zh/products/category/scale/announced';
    return this.request
      .request(url)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.hitBox a:not([target="_blank"])')
            .map((i, it) => $(it).attr('href'))
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
          const cover = 'https:' + $('#itemZoom1 > div:nth-child(1) > a:nth-child(2) > img:nth-child(1)').attr('src');
          const price = $('#itemBox dt:contains("價格")')
            .next()
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
