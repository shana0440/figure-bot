import { queueScheduler, Observable, of } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn, filter, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class AoshimaCrawler implements FigureCrawler {
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    return this.request
      .request('http://www.aoshima-bk.co.jp/product/?s=&brand=&category=%E3%83%95%E3%82%A3%E3%82%AE%E3%83%A5%E3%82%A2')
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('.item-list > li > a:nth-child(1)')
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
          const name = $('.mainContents > h1:nth-child(2)').text();
          // FIXME: should show not found image
          const coverSrc = $('.img > img:nth-child(1)').attr('src') || '';
          const cover = coverSrc.replace('http', 'https');
          const price = $('.itemData > dl:nth-child(2) > dd:nth-child(10)').text();
          const publishAt = $('.itemData > dl:nth-child(2) > dd:nth-child(8)')
            .text()
            .trim();
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
