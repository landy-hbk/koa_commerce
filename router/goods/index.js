const Router  = require('koa-router');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
let router = new Router();

// 批量添加商品信息
router.get('/insertAllGoodsInfo', async (ctx) => {
    fs.readFile('./const/goods.json', 'utf-8', function(err, data) {
        data = JSON.parse(data);
        let saveCount = 0;
        const Goods = mongoose.model('Goods');

        data.map( async (v, k) => {
            // 防止提交重复商品
            await Goods.findOne({ id: v.id }).exec().then(result => {
                if(!result) {
                    let newGoods = new Goods(v);
                    newGoods.save().then(res => {
                        saveCount++;
                        console.log('保存成功-----------', saveCount)
                    }).catch(err => {
                        console.log('保存失败！------', err)
                    })
                }else {
                    console.log('已存在商品------', v.id)
                }
            })

            
        })

    })

    ctx.body = "开始导入数据"
})

// 返回单个商品详情
router.get('/getGoodsDetailsInfo', async (ctx) => {
    let goodsId  = ctx.request.query.id;
    const Goods = mongoose.model('Goods');
    console.log('goodsId', goodsId, ctx.request.query)
    await Goods.findOne({ id: goodsId }).exec().then(result => {
        ctx.body = {
            code: 200,
            message:  null,
            data: result,
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            message:  err,
        }
    })
})


module.exports = router;