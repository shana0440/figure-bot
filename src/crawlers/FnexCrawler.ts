import { queueScheduler, Observable, of, firstValueFrom } from 'rxjs';
import { mergeMap, map, reduce, observeOn, catchError, filter } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class FnexCrawler implements FigureCrawler {
  name = 'Fnex';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://fnex.jp';
    const source = this.request.request(`${host}/products/search.php?categories[]=14&page=1`).pipe(
      map((resp) => resp.asHTML()),
      mergeMap(($) => {
        const links = $('.item')
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
        const name = $('.name').text();
        // FIXME: should show not found file image
        const cover = $('#tlarge > div.active > img').attr('src') || '';
        const price = $('.num').text();
        const publishAt = $('#form1 > section:nth-child(6) > div > h4').text();
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
