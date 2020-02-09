import { MockRequest } from '../MockRequest';

export class TokyofigureMockHTMLRequest extends MockRequest {
  constructor() {
    super([`${__dirname}/133.html`, `${__dirname}/134.html`, `${__dirname}/figure_list.html`]);
  }
}
