import axios from 'axios';
import * as Cheerio from 'cheerio';
import { Observable } from 'rxjs';

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
    return new Observable((subscribe) => {
      axios
        .request<string>({
          url,
          method: 'GET',
          headers,
        })
        .then((resp) => {
          subscribe.next(new Response(resp.data));
          subscribe.complete();
        })
        .catch((err) => {
          subscribe.error(err);
        });
    });
  }
}
