import { queueScheduler, Observable, of, firstValueFrom } from 'rxjs';
import { mergeMap, map, reduce, observeOn, filter, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class HakomusuCrawler implements FigureCrawler {
  name = 'Hakomusu';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://www.hakomusu.jp';
    const source = this.request.request(`${host}/figure.html`).pipe(
      map((resp) => resp.asHTML()),
      mergeMap(($) => {
        const links = $('.wideBox a')
          .map((i, it) => `${host}/${$(it).attr('href')}`)
          .get();

        console.info(`${this.name}: fetch ${links.length} figures.`);
        return this.figureRepo.filterSavedFigureURLs(links);
      }),
      mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
        this.request.request(url).pipe(map((resp) => [url, resp.asHTML()]))
      ),
      observeOn(queueScheduler),
      map(([url, $]) => {
        const name = $('#Side2 > h2:nth-child(2)').text();
        // FIXME: should show not found image
        const coverSrc = $('#photo > img:nth-child(1)').attr('src') || '';
        const cover = `${host}/${coverSrc}`;
        const price = $('li:contains("価格"), li:contains("価　格")')
          .text()
          .replace(/[価|格]/g, '')
          .trim();
        const publishAt = $('li:contains("発売")').first().text().replace('発売', '').trim();
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
