import { MockRequest } from '../MockRequest';

export class AlphamaxMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/ax0112asuna.html`,
      `${__dirname}/ax0165jeanne.html`,
      `${__dirname}/ax0224dai-yu_std.html`,
      `${__dirname}/ax0227vanilla.html`,
      `${__dirname}/ax0226chocola.html`,
      `${__dirname}/figure_list.html`,
    ]);
  }
}
