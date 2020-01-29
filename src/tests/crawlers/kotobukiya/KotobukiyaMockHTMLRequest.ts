import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

export class KotobukiyaMockHTMLRequest implements Request {
  private htmls: string[];

  constructor() {
    this.htmls = [
      readFileSync(`${__dirname}/product_0000003577.html`).toString(),
      readFileSync(`${__dirname}/product_0000003566.html`).toString(),
      readFileSync(`${__dirname}/figure_list.html`).toString(),
    ];
  }

  request() {
    const html = this.htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
