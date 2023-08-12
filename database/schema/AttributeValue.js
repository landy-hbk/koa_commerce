const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter')

// 商品属性value表接口
const AttributeValueSchema = new Schema({
    // 属性value id
    attribute_value_id: {
        type: Number,
        unique: true,
    },
    // key id
    attribute_key_id: {
      type: String,
      default: null,
    },
    // 选中key数组
    attribute_key: [Schema.Types.String],
    // 属性value 名称
    attribute_value_name: String,
    // 创建时间
    createTime: {
        type: Date,
        default: new Date(),
    }
})

AttributeValueSchema.pre("save", async function (next) {
    const role = this;
    if (!role.isNew || role.attribute_value_id) {
      return next();
    }
    try {
      if (!role.attribute_value_id) {
        role.attribute_value_id = await Counter.getNextSequenceValue("attribute_value_id"); // rid是你需要自增的属性
      }
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('AttributeValue', AttributeValueSchema)