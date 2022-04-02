const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const app = new Koa();

app.use(static(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');

const router = new Router();
const resolvers = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((res) => {
    resolvers.push(res);
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.body = '';
    return;
  }

  for (const res of resolvers) {
    res(message);
  }

  resolvers.length = 0;

  ctx.body = '';
});

app.use(router.routes());

module.exports = app;
