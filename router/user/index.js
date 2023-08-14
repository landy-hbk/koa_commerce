const Router  = require('koa-router');
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
let router = new Router();
const User = require('../../database/schema/User')
const Joi = require("joi");
const validateSchemaJoi = require("../../middlewares/validateSchemaJoi");

router.post('/login', async (ctx) => {
    const userName = ctx.request.body.userName;
    const passWord = ctx.request.body.passWord;

    // 引入user模型
    // const User  = mongoose.model('User');
    // console.log( userName, User, 'User')


    await User.findOne({ userName: userName }).exec().then(async result => {
        // console.log('result', result)
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
                            token: token,
                            uid: result._id
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

const userSchema = Joi.object({
    userName: Joi.string().min(1).required(),
});

// 用户注册
router.post('/register', async (ctx) => {
    const userName = ctx.request.body.userName;
    const passWord = ctx.request.body.passWord;

    let newUser = new User({
        userName,
        passWord,
    })
    .save()
    .then((res) => {
      ctx.body = {
        code: 200,
        message: "添加用户成功",
      };
    })
    .catch((err) => {
      ctx.body = {
        code: 500,
        message: "添加失败" + err,
      };
    });;
})

router.post('/update', async (ctx) => {
    // 引入user模型
    // const User  = mongoose.model('User');
    const uid  = ctx.request.body.uid || '';
    const avator  = ctx.request.body.avator || '';
    const userName = ctx.request.body.userName || '';
    console.log( ctx.request.body, 'update')
    await User.findOneAndUpdate({ _id: uid }, {
        avator: avator,
        userName: userName,
    },{ new: true }).then(result => {
        if(result) {
            ctx.body = {
                code: 200,
                message: '',
                data: {}
            }
        }else {
            ctx.body = {
                code: 500,
                message: '',
                data: {}
            }
        }
        // console.log(result, 'result')
    })

    // ctx.body = ctx.request.body;
})

router.get('/userInfo', async (ctx) => {
    // 引入user模型
    // const User  = mongoose.model('User');
    const uid  = ctx.request.query.uid || '';
    // console.log( userName, User, 'User')
    await User.findOne({ _id: uid }).exec().then(async result => {
        // 如果用户名存在
        if(result) {
            const { avator,userName } = result
            // console.log(result)
            ctx.body = {
                code: 200,
                message: "",
                data: {
                    avator: avator || '',
                    userName,
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

router.get('/list', async (ctx) => {
    // 引入user模型
    // const User  = mongoose.model('User');
    const uid  = ctx.request.query.uid || '';
    let page = ctx.request.body.page || 1;
    let limit = ctx.request.body.limit || 8;
    const start =(page - 1)*limit;
    // console.log( userName, User, 'User')
     const result =  await User.find().exec()

     console.log(result, 'result')
     ctx.body = {
        code: 200,
        data: result.slice((page-1)*limit, page*limit),
        page: {
            page: page,
            limit,
            total: result.length ,
            lastPage: parseInt(result.length / limit)
        }
     }

    // ctx.body = ctx.request.body;
})


module.exports = router;