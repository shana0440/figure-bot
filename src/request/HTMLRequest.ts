import { XMLHttpRequest as NodeXMLHttpRequest } from 'xmlhttprequest-ts';
import * as Cheerio from 'cheerio';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

import { Request, Headers } from './Request';

function createXHR() {
  return (new NodeXMLHttpRequest() as unknown) as XMLHttpRequest;
}

export class HTMLRequest implements Request {
  request(url: string, headers: Headers = {}) {
    return ajax({
      // rxjs ajax don't support node side
      // need to create own XMLHttpRequest
      // but the type is using dom side XMLHttpRequest
      // so force cast type here.
      createXHR,
      url,
      method: 'GET',
      headers,
    }).pipe(map((resp) => Cheerio.load(resp.xhr.responseText)));
  }
}
