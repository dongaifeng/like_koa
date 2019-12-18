const fs = require("fs");
const path = require("path");


module.exports = (dirPath = "./public") => {
  return async (ctx, next) => {

    // 判斷请求是不是 /public
    if (ctx.url.indexOf("/public") === 0) {
      // 获取绝对路径： public所在的  eg: F:\个人磁盘\kkb\19-koa源码\koa\public
      const url = path.resolve(__dirname, dirPath);

    

      // path.basename() 方法返回 path 的最后一部分  public
      const fileBaseName = path.basename(url);


      // 获取文件的绝对路径 因为 url里面有了/public 所以去掉请求里的 eg: F:\个人磁盘\kkb\19-koa源码\koa\public/index.html
      const filepath = url + ctx.url.replace("/public", "");
      try {
        // fs.statSync(fullPath) 返回stats对象
        stats = fs.statSync(filepath);


        //  fs.statSync(fullPath).isDirectory() 判断是路径还是文件
        if (stats.isDirectory()) {  
          const dir = fs.readdirSync(filepath); // 返回目录下的所有文件组成的数组 eg: [ 'a.css', 'index.html' ]

          console.log('=====>', dir)
          // 然后遍历数组 组合成a标签样式的链接
          const ret = ['<div style="padding-left:20px">'];
          dir.forEach(filename => {
            console.log(filename);
            // 简单认为不带小数点的格式，就是文件夹，实际应该用statSync
            if (filename.indexOf(".") > -1) {
              ret.push(
                `<p><a style="color:black" href="${
                ctx.url
                }/${filename}">${filename}</a></p>`
              );
            } else {
              // 文件
              ret.push(
                `<p><a href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            }
          });
          ret.push("</div>");
          ctx.body = ret.join("");
        } else {
          console.log("文件");
          const content = fs.readFileSync(filepath);
          ctx.body = content;
        }
      } catch (e) {
        // 报错了 文件不存在
        ctx.body = "404, not found";
      }
    } else {
      // 否则不是静态资源，直接去下一个中间件
      await next();
    }
  };
};

