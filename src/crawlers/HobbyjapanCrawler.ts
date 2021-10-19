import { queueScheduler, Observable, of } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn, filter, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class HobbyjapanCrawler implements FigureCrawler {
  name = 'Hobbyjapan';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const thisYear = new Date().getFullYear();
    const host = 'https://hobbyjapan.co.jp/ltd_items';
    return this.request
      .request(`${host}/${thisYear}.php`)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.list_img a')
            .map((i, it) => `${host}/${$(it).attr('href')}`)
            .get()
            // not interested in dolls yet.
            .filter((it: string) => !it.includes('dollybird.shopinfo.jp'));

          console.info(`${this.name}: fetch ${links.length} figures.`);
          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
          this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('#name')
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();
          // FIXME: should show not found image
          const coverSrc = $('#contents_left > img:nth-child(1)').attr('src') || '';
          const cover = url + coverSrc;
          const price = $('p:contains("価格")')
            .next()
            .text();
          const publishAt = $('p:contains("発送予定")')
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
          Sentry.captureException(err);
          return of(null);
        }),
        filter((it): it is Figure => it != null),
        reduce<Figure, Figure[]>((acc, it) => [...acc, it], [])
      )
      .toPromise();
  }
}
