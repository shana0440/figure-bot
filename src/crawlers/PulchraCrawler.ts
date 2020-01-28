import { forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class PulchraCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    const host = 'https://pulc.jp';
    return this.request
      .request(`${host}/category/select/cid/312/page/1/mode/2/language/ja`)
      .pipe(
        mergeMap(($) => {
          const links = $('.item .image > a')
            .map((i, it) => $(it).attr('href'))
            .get();

          return forkJoin(links.map((it) => this.request.request(it).pipe(map((x) => [it, x]))));
        }),
        map(($figures) => {
          return $figures.map(([url, $]) => {
            const name = $('div.title:nth-child(1) > h1:nth-child(1)').text();
            const cover = `${host}/` + $('#zoom_09').attr('src');
            const price = $('.price > h3').text();
            const publishAt = $('.description')
              .text()
              .match(/【発売日】(.*)\B/)[1];
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
