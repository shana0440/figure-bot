import { Observable, queueScheduler } from 'rxjs';
import { mergeMap, map, mergeAll, reduce, observeOn } from 'rxjs/operators';

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
        map(($) => {
          const links = $('.item .image > a')
            .map((i, it) => $(it).attr('href'))
            .get();
          return links;
        }),
        mergeAll<string>(),
        mergeMap<string, Observable<[string, CheerioStatic]>>((url) =>
          this.request.request(url).pipe(map(($) => [url, $]))
        ),
        observeOn(queueScheduler),
        map(([url, $]) => {
          const name = $('div.title:nth-child(1) > h1:nth-child(1)').text();
          const cover = `${host}/` + $('#zoom_09').attr('src');
          const price = $('.price > h3').text();
          const description = $('.description').text() || '';
          const match = description.match(/【発売日】(.*)\B/);
          const publishAt = (match && match[1]) || 'unknown';
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
      )
      .toPromise();
  }
}
