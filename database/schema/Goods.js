const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsSchema = new Schema({
    //商品名称
    "goods_name":  String,  
    // 商品价格
    "price":  Number,
    // 优惠价
    "present_price": Number,
    "amount":  Number,
    // 库存
    "sale_count": Number,
    "image_1": String,
    "image_2": String,
    "image_3": String,
    "image_4": String,
    "image_5": String,
    "image_6": String,
    // 是否上架
    "is_delete": Number,
    // 子类别
    "sub_id": String,
    // 商品id
    "id": String,
    // 商品类别
    "goods_type": String,
    // 商品封面图
    avator: String,
    // 轮播图
    imgs: [Schema.Types.Mixed],
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, },
}, {
    collations: 'Goods'
})

mongoose.model('Goods', goodsSchema)