import { MockRequest } from '../MockRequest';

export class AniplexPlusMockRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/itempTKdIzPT.html`,
      `${__dirname}/itemWkMOjdyq.html`,
      `${__dirname}/itemChCRrJqq.html`,
      `${__dirname}/figure_list_page_3.json`,
      `${__dirname}/figure_list_page_2.json`,
      `${__dirname}/figure_list_page_1.json`,
    ]);
  }
}
