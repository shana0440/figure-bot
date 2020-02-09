import { MockRequest } from '../MockRequest';

export class KotobukiyaMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/product_0000003577.html`,
      `${__dirname}/product_0000003566.html`,
      `${__dirname}/figure_list.html`,
    ]);
  }
}
