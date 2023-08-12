const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./Counter");

// 商品规格表接口
const GoodSpecsSchema = new Schema({
  // 商品id
  goods_id: {
    type: Schema.Types.ObjectId,
    unique: true,
    require: true,
    ref: "Goods",
  },
  // 规格id
  specs_id: {
    type: Number,
    unique: true,
  },
  // 规格名称
  specs_name: String,
  // 选中规格value数组
  select_specs: [Schema.Types.String || Schema.Types.Number],
  // 规格价格
  price: Number,
  // 规格库存
  stock: Number,
  // 创建时间
  createTime: {
    type: Date,
    default: new Date(),
  },
  // 修改时间
  updateTime: {
    type: Date,
  },
});

GoodSpecsSchema.pre("save", async function (next) {
  const role = this;
  if (!role.isNew || role.specs_id) {
    return next();
  }
  try {
    if (!role.specs_id) {
      role.specs_id = await Counter.getNextSequenceValue("specs_id"); // rid是你需要自增的属性
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("GoodSpecs", GoodSpecsSchema);
