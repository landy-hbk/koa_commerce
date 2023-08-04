const Koa = require("koa");
const { connect, initSchemas } = require("./database/index"); // moogose初始化
const mongoose = require("mongoose"); // 数据库
const router = require("./router/index.js"); // 路由
const bodyParser = require("koa-bodyparser"); // requeast请求
// const routers = require("koa-router")(); // 路由
const websocket = require("koa-websocket"); // socket
const jwt = require("koa-jwt"); // token验证
const jwtToken = require('jsonwebtoken');

(async () => {
  await connect();
  initSchemas();
})();

const app = websocket(new Koa());
const { jwtWhiteList } = require("./const/jwtWhiteList"); // token白名单
const koaStatic = require("koa-static"); // 静态目录
const koa2cors = require("koa2-cors"); // 配置跨域

// 建立socket连接
app.ws.use(async (ctx) => {
  // the websocket is added to the context as `ctx.websocket`.
  ctx.websocket.send("我是服务器");
  ctx.websocket.on("message", function (message) {
    // do something
    const msg = message.toString("utf-8");
    console.log("客户端发来消息", msg);
  });
});


// 自定义401错误 start 【可以不要，必须写在前面；洋葱模型，发生错误后是不会继续往下执行的】
// 如果token没有经过验证中间件会返回401错误，可以通过下面的中间件自定义处理这个错误
// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function (ctx, next) {
  // console.log("ce0", ctx.header.authorization)
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(" ");
    if (parts.length === 2) {
      //取出token
      const scheme = parts[0];
      const token = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        try {
          const decoded = jwtToken.verify(token, 'secret',{ complete: true });
          // iat: 签发时间  exp: 过期时间
          const { iat, exp, userName  } = decoded.payload;
          const nowTime = new Date().getTime()/1000;
          const lastTime  = (exp - nowTime)/60;
          // 当前事件离过期时间还剩一半的时候更新token 如果过期就走401
          if(decoded && 0 < lastTime &&  lastTime< ((exp-iat)/60)/2) {
            // console.log('更新token0')
            const newToken = jwtToken.sign({userName: userName}, 'secret', { expiresIn: '2h' });
            // console.log('更新token1', newToken)
            ctx.res.setHeader('Authorization', newToken)
          }
          
        } catch (error) {
          console.log("ce3")
          //token过期 
        }
      }
    }
  }

  return next().catch((err) => {
    if (401 == err.status || err.status === 301) {
      ctx.status = 401;
      ctx.body = {
        code: err.status,
        message: "token已经失效！！！！"
      };
      // ctx.body = {error: err.originalError ? err.originalError.message : err.message};
    } else {
      throw err;
    }
  });
});

app.use(koa2cors({
    origin: "*",
    maxAge: 5,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(bodyParser());
app.use(koaStatic("./"));
// 登录注册接口不验证'/api/login','/api/register'
// 验证失败会返回401错误
app.use(jwt({ secret: "secret" }).unless({ path: jwtWhiteList }));
app.use(router.routes()).use(router.allowedMethods());


app.listen(3000, () => {
  console.log("listen  start");
});