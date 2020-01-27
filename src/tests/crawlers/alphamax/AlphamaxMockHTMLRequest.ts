import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

const htmls: string[] = [
  readFileSync(`${__dirname}/ax0227vanilla.html`).toString(),
  readFileSync(`${__dirname}/ax0226chocola.html`).toString(),
  readFileSync(`${__dirname}/figure_list.html`).toString(),
];

export class AlphamaxMockHTMLRequest implements Request {
  request() {
    const html = htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
