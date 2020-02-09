import { Observable, queueScheduler, of } from 'rxjs';
import { mergeMap, map, mergeAll, reduce, observeOn, catchError, filter } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class PulchraCrawler implements FigureCrawler {
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://pulc.jp';
    return this.request
      .request(`${host}/category/select/cid/312/page/1/mode/2/language/ja`)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.item .image > a')
            .map((i, it) => $(it).attr('href'))
            .get();

          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, CheerioStatic]>>((url) =>
          this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('div.title:nth-child(1) > h1:nth-child(1)').text();
          const cover = encodeURI(`${host}/` + $('#zoom_09').attr('src'));
          const price = $('.price > h3').text();
          const description = $('.description').text() || '';
          const match = description.match(/【発売日】(.*)\B/);
          const publishAt = (match && match[1]) || 'unknown';
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
