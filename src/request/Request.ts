import { XMLHttpRequest as NodeXMLHttpRequest } from 'xmlhttprequest-ts';
import * as Cheerio from 'cheerio';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

function createXHR() {
  return (new NodeXMLHttpRequest() as unknown) as XMLHttpRequest;
}

export interface Headers {
  [key: string]: string;
}

export class Response {
  resp: string;

  constructor(resp: string) {
    this.resp = resp;
  }

  asJSON<T>(): T {
    return JSON.parse(this.resp);
  }

  asHTML(): cheerio.Root {
    return Cheerio.load(this.resp);
  }
}

export class Request {
  request(url: string, headers?: Headers): Observable<Response> {
    return ajax({
      // rxjs ajax don't support node side
      // need to create own XMLHttpRequest
      // but the type is using dom side XMLHttpRequest
      // so force cast type here.
      createXHR,
      url,
      method: 'GET',
      headers,
    }).pipe(map((resp) => new Response(resp.xhr.responseText)));
  }
}
