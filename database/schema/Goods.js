const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsSchema = new Schema({
    "goods_name":  String,
    "price":  Number,
    "present_price": Number,
    "amount":  Number,
    "sale_count": Number,
    "image_1": String,
    "image_2": String,
    "image_3": String,
    "image_4": String,
    "image_5": String,
    "image_6": String,
    "is_delete": Number,
    "sub_id": String,
    "id": String,
    "goods_type": String
}, {
    collations: 'Goods'
})

mongoose.model('Goods', goodsSchema)