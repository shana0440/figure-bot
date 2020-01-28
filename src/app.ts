import { resolve } from 'path';

import * as Koa from 'koa';
import * as morgan from 'koa-morgan';
import * as rfs from 'rotating-file-stream';
import * as bodyParser from 'koa-bodyparser';

import { config } from './config/Config';
import { Container } from './Container';

const app = new Koa();

const morganOptiosn = config.isProduction()
  ? {
      stream: rfs.createStream('access.log', {
        interval: '1m',
        path: resolve(__dirname, '../logs'),
      }),
    }
  : {};

app.use(morgan('common', morganOptiosn));
app.use(bodyParser());

const container = new Container(config);

app.use(async (ctx) => {
  const body = ctx.request.body;
  try {
    await container.lineFigureSender.handleRequestBody(body);
    ctx.status = 200;
    ctx.body = { ok: true };
  } catch (e) {
    // FIXME: error handling
  }
});

app.listen(config.port, () => {
  console.log(`start listen at ${config.port}`);
});
