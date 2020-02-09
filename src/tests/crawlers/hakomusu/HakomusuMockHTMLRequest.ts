import { MockRequest } from '../MockRequest';

export class HakomusuMockHTMLRequest extends MockRequest {
  constructor() {
    super([`${__dirname}/figure01.html`, `${__dirname}/figure18.html`, `${__dirname}/figure_list.html`]);
  }
}
