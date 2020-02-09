import { MockRequest } from '../MockRequest';

export class HobbyjapanMockHTMLRequest extends MockRequest {
  constructor() {
    super([`${__dirname}/hj20200201.html`, `${__dirname}/hj20200301.html`, `${__dirname}/figure_list.html`]);
  }
}
