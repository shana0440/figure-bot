import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

export class AlphamaxMockHTMLRequest implements Request {
  htmls: string[];

  constructor() {
    this.htmls = [
      readFileSync(`${__dirname}/ax0112asuna.html`).toString(),
      readFileSync(`${__dirname}/ax0165jeanne.html`).toString(),
      readFileSync(`${__dirname}/ax0224dai-yu_std.html`).toString(),
      readFileSync(`${__dirname}/ax0227vanilla.html`).toString(),
      readFileSync(`${__dirname}/ax0226chocola.html`).toString(),
      readFileSync(`${__dirname}/figure_list.html`).toString(),
    ];
  }

  request() {
    const html = this.htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
