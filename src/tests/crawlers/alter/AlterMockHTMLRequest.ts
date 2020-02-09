import { MockRequest } from '../MockRequest';

export class AlterMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/264.html`,
      `${__dirname}/261.html`,
      `${__dirname}/262.html`,
      `${__dirname}/2021.html`,
      `${__dirname}/2020.html`,
    ]);
  }
}
