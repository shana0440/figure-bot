import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Cheerio from 'cheerio';

import { Request } from '../../../request/Request';

const htmls: string[] = [
  readFileSync(`${__dirname}/POP_UP_PARADE_巧克力.html`).toString(),
  readFileSync(`${__dirname}/美遊_艾蒂菲爾特_Prisma_Klangfest_Ver.html`).toString(),
  readFileSync(`${__dirname}/figure_list.html`).toString(),
];

export class GoodSmileMockHTMLRequest implements Request {
  request() {
    const html = htmls.pop() || '';
    return of(html).pipe(map((it) => Cheerio.load(it)));
  }
}
