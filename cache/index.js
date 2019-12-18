const path = require("path");
let cache = {}
let time;

module.exports = function () {
  return async (ctx, next) => {
    const { url } = ctx

    if (url.indexOf("/data") === 0) {
      let name = path.basename(url)

      if(!time) {
        create_time()
      }

      if (cache[name]) {
        console.log('cache')
        ctx.body = cache[name]
      } else {
        ctx.body = cache[name] = await requestDB(url)
      }
    }

   
    await next();
  }
};
function create_time(){
  time = setInterval(() => {
    let date = new Date();
    console.log(date.getHours(),  '小时')
    console.log(date.getMinutes(), '分钟')
    console.log(date.getSeconds(), '秒')
    if (date.getHours() === 23 && date.getMinutes() === 59 && date.getSeconds() === 59){
      updat_cache()
      clearInterval(time)
    }
  }, 1000);
}

 function updat_cache(){
   console.log('update')
  Object.keys(cache).forEach(async (key) => {
    let url = `/data/${key}`
    cache[key] = await requestDB(url)
  })
}

function requestDB(url) {
  console.log('request ')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('cache data')
    }, 1000)
  })
}

