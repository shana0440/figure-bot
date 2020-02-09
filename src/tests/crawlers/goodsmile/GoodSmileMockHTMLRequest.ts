import { MockRequest } from '../MockRequest';

export class GoodSmileMockHTMLRequest extends MockRequest {
  constructor() {
    super([
      `${__dirname}/POP_UP_PARADE_巧克力.html`,
      `${__dirname}/美遊_艾蒂菲爾特_Prisma_Klangfest_Ver.html`,
      `${__dirname}/figure_list.html`,
    ]);
  }
}
