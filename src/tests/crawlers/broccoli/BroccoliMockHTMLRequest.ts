import { MockRequest } from '../MockRequest';

export class BroccoliMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/figure42_ga_mint.html`,
      `${__dirname}/figure47_zx_azumi.html`,
      `${__dirname}/figure_list.html`,
    ]);
  }
}
