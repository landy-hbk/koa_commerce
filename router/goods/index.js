const Router  = require('koa-router');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
let router = new Router();

const Goods = require('../../database/schema/Goods')

// 批量添加商品信息
router.get('/insertAllGoodsInfo', async (ctx) => {
    fs.readFile('./const/goods.json', 'utf-8', function(err, data) {
        data = JSON.parse(data);
        let saveCount = 0;
        // const Goods = mongoose.model('Goods');

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
    // const Goods = mongoose.model('Goods');
    // console.log('goodsId', goodsId, ctx.request.query)
    await Goods.findOne({ _id: goodsId }).exec().then(result => {
        console.log(result, 'result')
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

// 获取商品列表
router.post('/getGoodsList', async (ctx) => {
    console.log('cccc:', ctx.state.user)
    let page = ctx.request.body.page || 1;
    let limit = ctx.request.body.limit || 8;
    const start =(page - 1)*limit;
    // const Goods = mongoose.model('Goods');
    console.log('goodsId', ctx.request.body)
    // skip 从什么位置开始过滤
    // limit 一次获取多少个
    // console.log(Goods.count({}), 'count')
    
    // const result = await Goods.find().skip(start).limit(limit).exec()

    const result =  await Goods.find().exec()

    // console.log('result', result.slice(0,5))

    ctx.body = {
        code: 200,
        message:  null,
        data: result.slice((page-1)*limit, page*limit),
        page: {
            page: page,
            limit,
            total: result.length ,
            lastPage: parseInt(result.length / limit)
        }
    }
})

// 新增商品
router.put('/goodlist', async (ctx) => {
    // console.log(ctx.request.body,"body")
    const formData = ctx.request.body  || {};
    // const Goods = mongoose.model('Goods');
    const goods = {
        goods_name: formData.goods_name,
        price: formData.price,
        present_price: formData.present_price,
        sale_count: formData.sale_count,
        is_delete: false,
        avator: formData.avator,
        imgs: formData.imgs,
        categorys: formData.categorys,
    }
    let newGoods = new Goods(goods);

    await newGoods.save().then(res => {
        // console.log('保存成功！------', res)
        ctx.body =   {
            code: 200,
            message: "添加成功"
        }
    }).catch(err => {
    //    console.log('保存失败！------', err)
       ctx.body = {
            code: 500,
            message: "添加失败"+ err
        }
    })
})

// 修改商品
router.post('/goodlist', async (ctx) => { 
    const formData = ctx.request.body  || {};
    const goods_id = ctx.request.body.goods_id

    if(!goods_id) {
        ctx.body = {
            code: 500,
            message: "商品id不能为空"
        }

        return ;
    }

    const goods = {
        goods_name: formData.goods_name,
        price: formData.price,
        present_price: formData.present_price,
        sale_count: formData.sale_count,
        avator: formData.avator,
        imgs: formData.imgs,
        categorys: formData.categorys,
        updateTime: new Date(),
    }

    console.log(goods, 'goods')
    // const Goods = mongoose.model('Goods');

    await Goods.findOneAndUpdate({ _id: goods_id }, goods, { new: true }).then(result => {
        if(result) {
            ctx.body = {
                code: 200,
                message: '修改成功'
            }
        }else {
            ctx.body = {
                code: 500,
                message: '修改失败'
            }
        }
    })
})
// 删除商品
router.delete('/goodlist/:id', async (ctx) => { 
    const goods_id = ctx.params.id  || '';
    // const Goods = mongoose.model('Goods');

    if(!goods_id) {
        ctx.body = {
            code: 500,
            message: '商品id不能为空！'
        }
    }
    console.log(goods_id, 'goods_id', ctx.params)
    await Goods.findOneAndRemove({ _id: goods_id }).then(result => {
        console.log(result, 'result', typeof result)
        if(result) {
            ctx.body = {
                code: 200,
                message: '删除成功'
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            message: err
        }
    })
})

// 批量上架商品
router.post('/goodlist/batch', async (ctx) => {
    // const Goods = mongoose.model('Goods');
    let { good_list = '', type } = ctx.request.body
    good_list = good_list.split(',') || []; 
    let bulkOps = [];
    console.log(good_list, type, 'batch')
    if(good_list.length <= 0) {
        ctx.body = {
            code: 500,
            message: '商品id数组不能为空'
        }
    }

    good_list.forEach(item => {
        let  updateSql = {
            'updateOne': {
                'filter':  { _id:  item },
                'update':  { is_delete: type === 'openUp' ? 1 : 0,  'updateTime': new Date() },
                'upsert': true
            }
        }

        bulkOps.push(updateSql)
    })

    if(bulkOps.length > 0) {
       await Goods.bulkWrite(bulkOps).then(bulkWriteResult => {
            ctx.body = {
                code: 200,
                message: '批量更新已完成'
            }
       }).catch(err => {
            ctx.body = {
                code: 500,
                message: err
            }
       })
    }

}) 


module.exports = router;
