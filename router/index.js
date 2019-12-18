class Router {
  constructor() {
    this.stack = []
  }

  
  get(path, middleware) {
    this.register(path, 'get', middleware)
  }

  post(path, middleware) {
    this.register(path, 'post', middleware)
  }

  // stack 中push一个路由规则
  register(path, methods, middleware) {
    let route = { path, methods, middleware }
    this.stack.push(route)
  }


  // 当请求进来 拿到请求的method，url 然后遍历stack找匹配的路有规则
  // 然后执行这个路由规则里的中间件
  routes() {
    let stack = this.stack;
    return async function (ctx, next) {
      let currentPath = ctx.url;
      let route;
      for (let i = 0; i < stack.length; i++) {
        let { path, methods, middleware } = stack[i]
        if (currentPath === path && methods.indexOf(ctx.method) >= 0) {
          route = middleware;
          break;
        }
      }

      if (typeof route === 'function') {
        route(ctx, next);
        return;
      }
      await next();
    }
  }
}

module.exports = Router;
