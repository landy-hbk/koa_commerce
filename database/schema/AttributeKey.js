const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter')

// 商品属性表接口
const AttributeKeySchema = new Schema({
    // 商品属性组合id  _id
    // 分类id
    category_id: {
      type: String,
      require: true,
      ref: 'Category',
    },
    category: {
      type: [Schema.Types.String],
      require: true,
      default: [],
    },
    // 属性key id
    attribute_key_id: {
        type: Number,
        unique: true,
    },
    // 属性key 名称
    attribute_key_name: String,
    // 属性key 类型  默认数组 可支持单选 多选等
    attribute_type: {
        type: String,
        default: 'Array',
    },
    sort: {
      type: Number,
      default: 0,
    },
    // 创建时间
    createTime: {
        type: Date,
        default: new Date(),
    }
})

AttributeKeySchema.pre("save", async function (next) {
    const role = this;
    if (!role.isNew || role.attribute_key_id) {
      return next();
    }
    try {
      if (!role.attribute_key_id) {
        role.attribute_key_id = await Counter.getNextSequenceValue("attribute_key_id"); // rid是你需要自增的属性
      }
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('AttributeKey', AttributeKeySchema)