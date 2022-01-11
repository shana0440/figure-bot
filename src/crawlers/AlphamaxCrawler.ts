import { of, queueScheduler, Observable, firstValueFrom } from 'rxjs';
import { mergeMap, map, catchError, reduce, filter, observeOn } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class AlphamaxCrawler implements FigureCrawler {
  name = 'Alphamax';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://alphamax.jp';
    const source = this.request.request(`${host}/ja-JP/Categories/index/figure`).pipe(
      map((resp) => resp.asHTML()),
      mergeMap(($) => {
        const links = $('.product-link')
          .map((i, it) => host + $(it).attr('href'))
          .get();

        console.info(`${this.name}: fetch ${links.length} figures.`);
        return this.figureRepo.filterSavedFigureURLs(links);
      }),
      mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
        this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
      ),
      observeOn(queueScheduler),
      map(([url, $]) => {
        const name = $('.info-title').text();
        const cover = host + $('.main-image > img').attr('src');
        const price = $('td:contains("価格")').next().text();
        const publishAt = $('td:contains("発売日")').next().text();
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
    );
    return firstValueFrom(source);
  }
}
