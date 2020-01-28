import { resolve } from 'path';

import * as Koa from 'koa';
import * as morgan from 'koa-morgan';
import * as rfs from 'rotating-file-stream';
import * as bodyParser from 'koa-bodyparser';
import * as route from 'koa-route';

import { config } from './config/Config';
import { Container } from './Container';

const app = new Koa();

const morganOptiosn = config.isProduction()
  ? {
      stream: rfs.createStream('access.log', {
        interval: '1M',
        path: resolve(__dirname, '../logs'),
      }),
    }
  : {};

app.use(morgan('common', morganOptiosn));
app.use(bodyParser());

const container = new Container(config);

app.use(
  route.all('/line', async (ctx) => {
    const body = ctx.request.body;
    try {
      await container.lineFigureSender.handleRequestBody(body);
      ctx.status = 200;
      ctx.body = { ok: true };
    } catch (e) {
      // FIXME: error handling
    }
  })
);

app.use(
  route.all('/ping', (ctx) => {
    ctx.status = 200;
    ctx.body = 'pong';
  })
);

app.listen(config.port, () => {
  console.log(`start listen at ${config.port}`);
});
