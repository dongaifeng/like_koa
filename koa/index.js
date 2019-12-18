const http = require('http');

const context = require("./context");
const request = require("./request");
const response = require("./response");


class koa {
  constructor(){
    this.cb = []
  }
  // 实现koa的listren方法
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = this.createContext(req, res);

      const fn = this.compose(this.cb) // 合成一个大的函数 中间件套中间件 然后use的中间件就没用了
      await fn(ctx);
      res.end(ctx.body); // 没次请求过来 会执行这个大的合成中间件 他会维护一个 body。 然后等他执行完 再end
    });

    server.listen(...args);
  }

  // use方法实现  就是把中间件push到数组里
  use(cb) {
    this.cb.push(cb);
  }

  // 构建上下文, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  // 合成函数
  compose(middlewares) {
    return function (ctx) { // 传入上下文
      return dispatch(0);
      function dispatch(i) {
        let fn = middlewares[i];
        if (!fn) {
          return Promise.resolve();
        }
        return Promise.resolve(
          fn(ctx, function next() {  // 将上下文传入中间件
            return dispatch(i + 1);
          })
        );
      }
    };
  }

}

module.exports = koa;


