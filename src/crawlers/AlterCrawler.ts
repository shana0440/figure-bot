import { concat, queueScheduler } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class AlterCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const thisYear = new Date().getFullYear();
    const host = 'https://alter-web.jp';
    const requests = [];
    for (let i = 0; i < 2; i++) {
      const year = thisYear + i;
      const request = this.request.request(`${host}/figure/?yy=${year}&mm=`).pipe(
        map(($) => {
          const links = $('figure a')
            .map((i, it) => host + $(it).attr('href'))
            .get();
          return links;
        }),
        mergeAll<string>(),
        mergeMap((url) => this.request.request(url)),
        observeOn(queueScheduler),
        map(($) => {
          const url = host + $('#topicpath li:last-child a').attr('href');
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
        reduce<Figure, Figure[]>((acc, it) => [...acc, it], [])
      );
      requests.push(request);
    }
    return concat(...requests)
      .pipe(reduce((acc, it) => [...acc, ...it]))
      .toPromise();
  }
}
