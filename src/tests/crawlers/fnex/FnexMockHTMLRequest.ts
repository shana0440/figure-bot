import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

const htmls: string[] = [
  readFileSync(`${__dirname}/54.html`).toString(),
  readFileSync(`${__dirname}/53.html`).toString(),
  readFileSync(`${__dirname}/51.html`).toString(),
  readFileSync(`${__dirname}/52.html`).toString(),
  readFileSync(`${__dirname}/figure_list.html`).toString(),
];

export class FnexMockHTMLRequest implements Request {
  request() {
    const html = htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
