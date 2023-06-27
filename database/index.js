const mongoose = require('mongoose')
const db = "mongodb://127.0.0.1/waimai"
const glob  = require('glob');
const { resolve } = require('path')

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', './*.js')).forEach((v) => {
        require(v)
    })
}

exports.connect = () => {
    // 连接数据库
    mongoose.connect(db)

    return new Promise((resolve, reject) => {
        // 添加数据库监听事件
        mongoose.connection.on('disconnected', () => {
            console.log('数据库断开---------------')
            mongoose.connect(db)
        })

        // 添加数据库监听事件
        mongoose.connection.on('open', () => {
            console.log('数据库连接---------------')
            mongoose.connect(db)

            resolve();
        })
    })

    
}