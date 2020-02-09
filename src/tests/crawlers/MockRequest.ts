import { readFileSync } from 'fs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Request, Response } from '../../request/Request';

export class MockRequest extends Request {
  htmls: string[];

  constructor(htmls: string[]) {
    super();
    this.htmls = htmls.map((it) => readFileSync(it).toString());
  }

  request() {
    const html = this.htmls.pop() || '';
    return of(html).pipe(map((it) => new Response(it)));
  }
}
