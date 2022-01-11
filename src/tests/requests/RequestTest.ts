import { map } from 'rxjs/operators';

import { Request } from '../../request/Request';

describe('Request', function () {
  it('fetch html as cheerio', function (done) {
    if (process.env.CI) {
      done();
      return;
    }
    const request = new Request();
    const url = 'https://www.google.com.tw';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0',
    };
    request
      .request(url, headers)
      .pipe(map((resp) => resp.asHTML()))
      .subscribe(($) => {
        const searchBtn = $('input[value="Google 搜尋"]');
        expect(searchBtn.length).toBe(2);
        done();
      });
  });

  it('fetch json', function (done) {
    interface GithubAPI {
      current_user_url: string;
    }

    if (process.env.CI) {
      done();
      return;
    }
    const request = new Request();
    const url = 'https://api.github.com/';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0',
    };
    request
      .request(url, headers)
      .pipe(map((resp) => resp.asJSON<GithubAPI>()))
      .subscribe((resp) => {
        expect(resp.current_user_url).toBe('https://api.github.com/user');
        done();
      });
  });
});
