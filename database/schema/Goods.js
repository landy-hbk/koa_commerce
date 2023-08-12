const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter')

// 商品表接口
const goodsSchema = new Schema({
    // 商品自增id
    "goods_id": {
        type: Number,
        unique: true,
    },
    // 规格id
    "specs_id": {
        type: Schema.Types.ObjectId,
        ref: 'Specs',
        default: null,
    },
    // 品牌id
    "brand_id": {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        default: null,
    },
    //商品名称
    "goods_name":  String,  
    // 商品价格
    "price":  Number,
    // 优惠价
    "present_price": Number,
    "amount":  Number,
    // 库存
    "sale_count": Number,
    // 是否上架
    "is_delete": Number,
    categorys: {
        type: [Schema.Types.Number || Schema.Types.String],
        default: null,
    },
    // 子类别
    "sub_id": String,
    // // 商品id
    // "id": String,
    // 商品类别
    "goods_type": String,
    // 商品封面图
    avator: String,
    // 轮播图
    imgs: [Schema.Types.Mixed],
    // 创建时间
    createTime: { type: Date, default: Date.now },
    // 修改时间
    updateTime: { type: Date, },
}, {
    collations: 'Goods'
})

goodsSchema.pre("save", async function (next) {
    const role = this;
    if (!role.isNew || role.goods_id) {
      return next();
    }
    try {
      if (!role.goods_id) {
        role.goods_id = await Counter.getNextSequenceValue("goods_id"); // rid是你需要自增的属性
      }
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('Goods', goodsSchema)