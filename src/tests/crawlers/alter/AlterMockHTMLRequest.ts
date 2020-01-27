import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

const htmls: string[] = [
  readFileSync(`${__dirname}/264.html`).toString(),
  readFileSync(`${__dirname}/261.html`).toString(),
  readFileSync(`${__dirname}/262.html`).toString(),
  readFileSync(`${__dirname}/2021.html`).toString(),
  readFileSync(`${__dirname}/2020.html`).toString(),
];

export class AlterMockHTMLRequest implements Request {
  request() {
    const html = htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
