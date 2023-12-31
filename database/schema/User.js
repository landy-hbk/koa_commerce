const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

// 前台用户表接口
const userSchema = new Schema({
    UserId: ObjectId,
    userName: {
        unique: true,
        type: String
    },
    passWord: String,
    avator: String,
    hashPassword: String,
    nikeName: String,
    address: String,
    isBlack: Boolean,
    sex: String,
    createAt: {
        type: Date,
        default: Date.now(),
    },
    lastLoginAt: {
        type: Date,
        default: Date.now(),
    },
})

// 每次存储时都要执行，加盐加密
userSchema.pre('save', function (next){
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.passWord,salt,(err,hash)=>{
            if(err) return next(err)
            this.hashPassword = hash
            next()
        })
    })
})

// 添加自定义方法
userSchema.methods = {
    comparePassword: (_password, hashPassword) => {
        return new Promise((resolve, reject) => {
            // 对比密码是否一致
            bcrypt.compare(_password, hashPassword, (err, isMatch) => {
                if(!err) resolve(isMatch);

                reject(err)
            })
        }) 
    }
}
// 发布模型
module.exports = mongoose.model('User', userSchema)
