import { MockRequest } from '../MockRequest';

export class AoshimaMockHTMLRequest extends MockRequest {
  constructor() {
    super([`${__dirname}/4905083107188.html`, `${__dirname}/4905083106204.html`, `${__dirname}/figure_list.html`]);
  }
}
