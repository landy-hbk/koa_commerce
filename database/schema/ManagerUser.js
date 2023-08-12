const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const Counter = require('./Counter')

const SALT_WORK_FACTOR = 10;

// 后台用户表接口
const ManagerUserSchema = new Schema({
    UserId: ObjectId,
    userName: {
        unique: true,
        type: String
    },
    // 自增id
    manager_user_id: {
        type: Number,
        unique: true,
    },
    sex: {
        type: Number,
        default: 0 // 0男   1女  
    },
    role_id: {
        type: ObjectId,
        ref: 'Role',
    },
    role_name: {
        type: String,
        default: '',
    },
    passWord: String,
    avator: String,
    hashPassword: String,
    nikeName: String,
    address: String,
    // 是否黑名单
    isBlack: Number,  // 0false   1true
    // 备注
    notes: String, 
    createTime: {
        type: Date,
        default: Date.now(),
    },
    updateTime: {
        type: Date,
    },
    lastLoginAt: {
        type: Date,
        default: Date.now(),
    }
})

// 每次存储时都要执行，加盐加密
ManagerUserSchema.pre('save', function (next){
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.passWord,salt,(err,hash)=>{
            if(err) return next(err)
            this.hashPassword = hash
            next()
        })
    })
})

ManagerUserSchema.pre("save", async function (next) {
    const role = this;
    if (!role.isNew || role.manager_user_id) {
      return next();
    }
    try {
      if (!role.manager_user_id) {
        role.manager_user_id = await Counter.getNextSequenceValue("manager_user_id"); // rid是你需要自增的属性
      }
    } catch (err) {
      next(err);
    }
});

// 添加自定义方法
ManagerUserSchema.methods = {
    comparePassword: (_password, hashPassword) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, hashPassword, (err, isMatch) => {
                if(!err) resolve(isMatch);

                reject(err)
            })
        }) 
    }
}
// 发布模型
module.exports = mongoose.model('ManagerUser', ManagerUserSchema)
