import { concat, queueScheduler, Observable, of, firstValueFrom } from 'rxjs';
import { mergeMap, map, reduce, observeOn, catchError, filter } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class AlterCrawler implements FigureCrawler {
  name = 'Alter';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const thisYear = new Date().getFullYear();
    const host = 'https://alter-web.jp';
    const requests = [];
    for (let i = 0; i < 2; i++) {
      const year = thisYear + i;
      const request = this.request.request(`${host}/figure/?yy=${year}&mm=`).pipe(
        map((resp) => resp.asHTML()),
        mergeMap(($) => {
          const links = $('figure a')
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
          const name = $('#topicpath li:last-child a').text();
          const cover = host + $('.item-mainimg > figure > img').attr('src');
          const price = $(
            'div.cells:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)'
          ).text();
          const publishAt = $(
            'div.cells:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)'
          ).text();
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
      requests.push(request);
    }
    const source = concat(...requests).pipe(reduce((acc, it) => [...acc, ...it]));
    return firstValueFrom(source);
  }
}
