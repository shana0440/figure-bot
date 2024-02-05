import { Observable, queueScheduler, of, firstValueFrom } from 'rxjs';
import { mergeMap, map, reduce, observeOn, catchError, filter } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class KotobukiyaCrawler implements FigureCrawler {
  name = 'Kotobukiya';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://www.kotobukiya.co.jp';
    const source = this.request.request(`${host}/product/figures/female-character-figures/`).pipe(
      map((resp) => resp.asHTML()),
      mergeMap(($) => {
        const links = $('.productList_item a')
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
        const name = $('.pageHeader02_title').text();
        const cover = host + $('.detailSlider_thumbs img').attr('src');
        const price = $('.detailHeader_set-price dd span:nth-child(1)').text().replace(/\s/g, '');
        const publishAt = $('.detailHeader_set-release dd').text().replace(/\s/g, '');
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
