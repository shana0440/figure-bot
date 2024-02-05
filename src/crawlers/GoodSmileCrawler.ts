import { queueScheduler, Observable, of, firstValueFrom } from 'rxjs';
import { mergeMap, map, observeOn, reduce, filter, catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class GoodSmileCrawler implements FigureCrawler {
  name = 'GoodSmile';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://goodsmileshop.com';
    const url = `${host}/tw/%E9%A1%9E%E5%88%A5%E6%A0%B9%E7%9B%AE%E9%8C%84/%E6%AF%94%E4%BE%8B%E6%A8%A1%E5%9E%8B/c/91?sort=postingDate&q=%3AmaxEndDateProduct`;
    const source = this.request
      .request(url, {
        cookie: 'age_verification_ok=true;',
      })
      .pipe(
        map((resp) => resp.asHTML()),
        mergeMap(($) => {
          const links = $('.productGrid .group a')
            .map((i, it) => host + $(it).attr('href'))
            .get();

          console.info(`${this.name}: fetch ${links.length} figures.`);
          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeMap<string, Observable<[string, cheerio.Root]>>((url) =>
          this.request
            .request(url, {
              cookie: 'age_verification_ok=true;',
            })
            .pipe(map((resp) => [url, resp.asHTML()]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('th:contains("商品名稱")').next().text();
          const cover = host + $('#imageLink > img').attr('data-original');
          const price = $('.qty div:contains("價格")').next().text().replace(/\s/g, '');
          const publishAt = $('th:contains("發售日")').next().text().replace(/\s/g, '');
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
