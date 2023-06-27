const Router  = require('koa-router');
const mongoose = require('mongoose')

let router = new Router();

router.get('/', async (ctx) => {
    ctx.req = {
        name: 'ce'
    }
})

router.post('/login', async (ctx) => {
    console.log(ctx.request.body)
    const userName = ctx.request.body.userName;
    const passWord = ctx.request.body.passWord;

    // 引入user模型
    const User  = mongoose.model('User');
    // console.log( userName, User, 'User')


    await User.findOne({ userName: userName }).exec().then(async result => {
        // console.log('result', result)
        // 如果用户名存在
        if(result) {
            let newUser = new User();
            await newUser.comparePassword(passWord, result.hashPassword).then(isMatch => {
                // console.log('isMatch', isMatch)
                if(isMatch) {
                    ctx.body = {
                        code: 200,
                        message: isMatch
                    }
                }else {
                    ctx.body = {
                        code: 500,
                        message: isMatch
                    }
                }
            })
        }else {
            ctx.body = {
                code: 500,
                message: '用户名不存在！'
            }
        }
    }).catch(err => {
        // console.log('result----err')
        ctx.body = {
            code: 500,
            message: err,
        }
    })

    // ctx.body = ctx.request.body;
})


module.exports = router;