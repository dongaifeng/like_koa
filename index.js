const koa = require("./koa");
const app = new koa();

const Router = require('./router/index');
const router = new Router()

const static = require('./static/index')
app.use(static(__dirname + '/public'));

const cache = require('./cache/index');
app.use(cache())

// 调用get方法
router.get('/', async ctx => {
  // console.log('index,xx')
  ctx.body = 'index page';
});


// 路由实例输出父中间件 router.routes()
app.use(router.routes());

app.listen(3000, () => {
  console.log("监听端口3000");
});
