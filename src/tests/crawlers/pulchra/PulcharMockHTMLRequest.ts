import { MockRequest } from '../MockRequest';

export class PulcharMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/8961.html`,
      `${__dirname}/8962.html`,
      `${__dirname}/8963.html`,
      `${__dirname}/figure_list.html`,
    ]);
  }
}
