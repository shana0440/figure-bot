import { MockRequest } from '../MockRequest';

export class FnexMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/54.html`,
      `${__dirname}/53.html`,
      `${__dirname}/51.html`,
      `${__dirname}/52.html`,
      `${__dirname}/figure_list.html`,
    ]);
  }
}
