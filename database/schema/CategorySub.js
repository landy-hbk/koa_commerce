const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySubShema = new Schema({
    id: {
        type: Number,
    },
    mall_category_id: {
        type: String,
    },
    mall_id: {
        type: Number,
    },
    mall_sub_name: {
        type: String,
    },
    image: {
        type: String,
    },
    sort: {
        type: Number,
    },
}) 

mongoose.model("CategorySub", categorySubShema)