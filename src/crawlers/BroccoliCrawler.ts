import { queueScheduler, Observable, of } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn, filter, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class BroccoliCrawler implements FigureCrawler {
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://www.broccoli.co.jp';
    return this.request
      .request(`${host}/hobby_index/`)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.pre a,.def a')
            .map((i, it) => host + $(it).attr('href'))
            .get();

          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
          this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('th:contains("商品名")')
            .next()
            .text();
          // FIXME: should show not found image
          const coverSrc =
            $('.photoGallery > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1) > img:nth-child(1)').attr('src') ||
            '';
          const cover = host + coverSrc;
          const price = $('th:contains("価格")')
            .next()
            .text();
          const publishAt = $('th:contains("発売日")')
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
