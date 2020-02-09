import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

export class HakomusuMockHTMLRequest implements Request {
  htmls: string[];

  constructor() {
    this.htmls = [
      readFileSync(`${__dirname}/figure01.html`).toString(),
      readFileSync(`${__dirname}/figure18.html`).toString(),
      readFileSync(`${__dirname}/figure_list.html`).toString(),
    ];
  }

  request() {
    const html = this.htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
