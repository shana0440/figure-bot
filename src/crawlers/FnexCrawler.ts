import { forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class FnexCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const host = 'https://fnex.jp';
    return this.request
      .request(`${host}/products/search.php?categories[]=14&page=1`)
      .pipe(
        mergeMap(($) => {
          const links = $('.item')
            .map((i, it) => host + $(it).attr('href'))
            .get();
          return forkJoin(links.map((it) => this.request.request(it).pipe(map((x) => [it, x]))));
        }),
        map(($figures) => {
          return $figures.map(([url, $]) => {
            const name = $('.name').text();
            const cover = $('#tlarge > div.active > img').attr('src');
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
          });
        })
      )
      .toPromise();
  }
}
