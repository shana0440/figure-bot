import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

export class AlterMockHTMLRequest implements Request {
  private htmls: string[];

  constructor() {
    this.htmls = [
      readFileSync(`${__dirname}/264.html`).toString(),
      readFileSync(`${__dirname}/261.html`).toString(),
      readFileSync(`${__dirname}/262.html`).toString(),
      readFileSync(`${__dirname}/2021.html`).toString(),
      readFileSync(`${__dirname}/2020.html`).toString(),
    ];
  }

  request() {
    const html = this.htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
