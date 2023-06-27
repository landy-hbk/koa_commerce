const Koa  = require('koa');
const app = new Koa();
const { connect, initSchemas } = require('./database/index');
const mongoose = require('mongoose')
const router = require('./router/index.js');
const bodyParser = require('koa-bodyparser')

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());



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

app.use(async ctx => {
    ctx.body = 'hello Word in koa';
})

app.listen(3000, () => {
    console.log('listen  start')
})
