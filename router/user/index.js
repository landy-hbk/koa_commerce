const Router  = require('koa-router');
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
let router = new Router();

router.post('/login', async (ctx) => {
    const userName = ctx.request.body.userName;
    const passWord = ctx.request.body.passWord;

    // 引入user模型
    const User  = mongoose.model('User');
    // console.log( userName, User, 'User')


    await User.findOne({ userName: userName }).exec().then(async result => {
        // 如果用户名存在
        if(result) {
            let newUser = new User();
            await newUser.comparePassword(passWord, result.hashPassword).then(isMatch => {
                // console.log('isMatch', isMatch)
                if(isMatch) {
                    // 生成token
                    const token = jwt.sign({userName: result.userName}, 'secret', { expiresIn: '2h' });
                    ctx.body = {
                        code: 200,
                        message: isMatch,
                        data: {
                            token: token
                        }
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

router.get('/userInfo', async (ctx) => {
    // 引入user模型
    const User  = mongoose.model('User');
    // console.log( userName, User, 'User')


    await User.findOne({ userName: "test3" }).exec().then(async result => {
        // 如果用户名存在
        if(result) {
            ctx.body = {
                code: 200,
                message: "",
                data: {
                    userName: result.userName
                }
            }
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