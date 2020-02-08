import 'mocha';
import { expect } from 'chai';

import { HTMLRequest } from '../../request/HTMLRequest';

describe('HTML Request', function() {
  it('fetch html as cheerio', function(done) {
    if (process.env.CI) {
      done();
      return;
    }
    const request = new HTMLRequest();
    const url = 'https://www.google.com.tw';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0',
    };
    request.request(url, headers).subscribe(($) => {
      const searchBtn = $('input[value="Google 搜尋"]');
      expect(searchBtn.length).equal(2);
      done();
    });
  });
});
