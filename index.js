const Koa  = require('koa');
const { connect, initSchemas } = require('./database/index');
const mongoose = require('mongoose')
const router = require('./router/index.js');
const bodyParser = require('koa-bodyparser')
const routers = require('koa-router')()
const websocket = require('koa-websocket');


const app = websocket(new Koa())


app.ws.use(async (ctx) => {
    // the websocket is added to the context as `ctx.websocket`.
    ctx.websocket.send('我是服务器')
   ctx.websocket.on('message', function(message) {
     // do something
     const msg = message.toString('utf-8')
     console.log('客户端发来消息', msg)
   });
 });

app.use(bodyParser());
app.ws.use(router.routes()).use(router.allowedMethods());




;(async () => {
    await connect();
    await initSchemas();

    const User  = mongoose.model('User');
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
})()

// app.use(async ctx => {
//     ctx.body = 'hello Word in koa';
// })

app.listen(3000, () => {
    console.log('listen  start')
})
