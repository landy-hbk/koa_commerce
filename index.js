const Koa = require("koa");
const { connect, initSchemas } = require("./database/index"); // moogose初始化
const mongoose = require("mongoose"); // 数据库
const router = require("./router/index.js"); // 路由
const bodyParser = require("koa-bodyparser"); // requeast请求
// const routers = require("koa-router")(); // 路由
const websocket = require("koa-websocket"); // socket
var jwt = require("koa-jwt"); // token验证
const app = websocket(new Koa());
const { jwtWhiteList } = require("./const/jwtWhiteList"); // token白名单
const koaStatic = require("koa-static"); // 静态目录

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
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = "token验证失败！！！！";
      // ctx.body = {error: err.originalError ? err.originalError.message : err.message};
    } else {
      throw err;
    }
  });
});


console.log(jwtWhiteList, "jwtWhiteList");
app.use(bodyParser());
app.use(koaStatic("./"));
// 登录注册接口不验证'/api/login','/api/register'
// 验证失败会返回401错误
app.use(jwt({ secret: "secret" }).unless({ path: jwtWhiteList }));
app.use(router.routes()).use(router.allowedMethods());

(async () => {
  await connect();
  await initSchemas();

  const User = mongoose.model("User");
  // const ce =  User.findOne({ userName: 'test3' }).exec().then(res => {
  //     console.log(res, 'res--------------')
  // })

  // console.log(ce, 'ce--------------')
  // let oneUser = new User({
  //     userName: 'test3',
  //     passWord:  'test2223'
  // });

  // oneUser.save().then(() => {
  //     console.log('插入成功')
  // })

  // let user = await User.findOne({}).exec()

  // console.log(User, 'User--------------')
})();

// app.use(async ctx => {
//     ctx.body = 'hello Word in koa';
// })

app.listen(3000, () => {
  console.log("listen  start");
});
