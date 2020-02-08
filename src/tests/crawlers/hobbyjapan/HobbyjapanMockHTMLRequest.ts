import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

export class HobbyjapanMockHTMLRequest implements Request {
  private htmls: string[];

  constructor() {
    this.htmls = [
      readFileSync(`${__dirname}/hj20200201.html`).toString(),
      readFileSync(`${__dirname}/hj20200301.html`).toString(),
      readFileSync(`${__dirname}/figure_list.html`).toString(),
    ];
  }

  request() {
    const html = this.htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
