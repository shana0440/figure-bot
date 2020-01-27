import { Observable } from 'rxjs';

export interface Headers {
  [key: string]: string;
}

export interface Request {
  request: (url: string, headers?: Headers) => Observable<CheerioStatic>;
}
