import { of, queueScheduler, Observable } from 'rxjs';
import { mergeMap, map, catchError, mergeAll, reduce, filter, observeOn } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

export class AniplexPlusCrawler implements FigureCrawler {
  name = 'AniplexPlus';
  private request: Request;
  private figureRepo: FigureRepository;

  constructor(request: Request, figureRepo: FigureRepository) {
    this.request = request;
    this.figureRepo = figureRepo;
  }

  async fetchFigures() {
    const host = 'https://www.aniplexplus.com';
    const url = `${host}/on/demandware.store/Sites-ANX-Site/ja_JP/Search-UpdateGrid?cgid=titlelist&prefn1=productMediaCode&prefv1=%E3%83%95%E3%82%A3%E3%82%AE%E3%83%A5%E3%82%A2&start=0&sz=365&selectedUrl=${host}/on/demandware.store/Sites-ANX-Site/ja_JP/Search-UpdateGrid?cgid=titlelist&prefn1=productMediaCode&prefv1=%E3%83%95%E3%82%A3%E3%82%AE%E3%83%A5%E3%82%A2&start=0&sz=365`;
    return this.request
      .request(url)
      .pipe(
        map((resp) => resp.asHTML()),
        map(($) => {
          const links = $('article.c-mid-tile > a')
            .map((_, it) => {
              const href = $(it).attr('href');
              return host + href;
            })
            .get();
          console.info(`${this.name}: fetch ${links.length} figures.`);
          return this.figureRepo.filterSavedFigureURLs(links);
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, cheerio.Root]>>((url) => {
          return this.request.request(url).pipe(
            map((resp) => resp.asHTML()),
            map(($) => [url, $])
          );
        }),
        observeOn<[string, cheerio.Root]>(queueScheduler),
        map<[string, cheerio.Root], Figure>(([url, $]) => {
          const name = $('.product-details .product-name').text();
          const cover = host + $('.product__image img:first').attr('src');
          const price = $('.price')
            .text()
            .replace(/\n|\s/g, '');
          const publishAt =
            $('.footer-item__title > span:contains(お届け時期)')
              .parents('.detail__footer-item')
              .find('.itemDetail :contains(お届け予定):first')
              .text()
              .replace(/\s/g, '') || $('.salesStartDate__txt:first').text();
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
      .toPromise() as Promise<Figure[]>;
  }
}
