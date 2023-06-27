const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySubShema = new Schema({
    id: {
        unique: true,
        type: String,
    },
    mall_category_id: {
        type: String,
    },
    mall_sub_name: {
        type: String,
    },
    comments: {
        type: String,
    },
    sort: {
        type: Number,
    },
}) 

mongoose.model("CategorySub", categorySubShema)