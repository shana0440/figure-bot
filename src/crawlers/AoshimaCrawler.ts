import { queueScheduler, Observable } from 'rxjs';
import { mergeMap, map, reduce, mergeAll, observeOn } from 'rxjs/operators';

import { FigureCrawler } from './FigureCrawler';
import { Request } from '../request/Request';
import { Figure } from '../models/Figure';

export class AoshimaCrawler implements FigureCrawler {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  async fetchFigures() {
    return this.request
      .request('http://www.aoshima-bk.co.jp/product/?s=&brand=&category=%E3%83%95%E3%82%A3%E3%82%AE%E3%83%A5%E3%82%A2')
      .pipe(
        map(($) => {
          const links = $('.item-list > li > a:nth-child(1)')
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
          const name = $('.mainContents > h1:nth-child(2)').text();
	  // FIXME: should show not found image
          const coverSrc = $('.img > img:nth-child(1)').attr('src') || '';
          const cover = coverSrc.replace('http', 'https');
          const price = $('.itemData > dl:nth-child(2) > dd:nth-child(10)').text();
          const publishAt = $('.itemData > dl:nth-child(2) > dd:nth-child(8)')
            .text()
            .trim();
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
