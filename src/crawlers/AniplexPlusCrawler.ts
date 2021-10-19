import { of, queueScheduler, Observable, interval } from 'rxjs';
import { mergeMap, map, catchError, mergeAll, reduce, filter, observeOn, takeWhile } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { FigureCrawler } from './FigureCrawler';
import { Request, Response } from '../request/Request';
import { Figure } from '../models/Figure';
import { FigureRepository } from '../repositories/FigureRepository';

interface ItemsResponse {
  found: number;
  start: number;
  hit: { id: string }[];
}

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
    return interval()
      .pipe(
        mergeMap((i) => {
          const start = i * 20;
          const url = `${host}/search/items?keyword=&start=${start}&category[]=e38395e382a3e382aee383a5e382a2`;
          return this.request.request(url);
        }),
        map<Response, ItemsResponse>((resp) => resp.asJSON<ItemsResponse>()),
        takeWhile((resp) => resp.start < resp.found),
        map<ItemsResponse, string[]>((resp) => {
          const links = resp.hit.map((it) => {
            const id = it.id;
            return `${host}/item${id}`;
          });
          return links;
        }),
        reduce<string[], string[]>((acc, urls) => [...acc, ...urls], []),
        map<string[], string[]>((urls) => {
          console.info(`${this.name}: fetch ${urls.length} figures.`);
          return this.figureRepo.filterSavedFigureURLs(urls);
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
          const name = $('.fz24,.fz18,.fz22,.fz20,.fz14').text();
          const cover = host + $('.current > img:nth-child(1)').attr('data-src_normal');
          const price = $('.itemPrice').text();
          const publishAt = $('.itemDate').text();
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
