const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySubShema = new Schema({
    id: {
        unique: true,
        type: Number,
    },
    mall_category_id: {
        type: String,
    },
    category_id: {
        type: Schema.ObjectId,
        require: true,
        ref: "Category"
    },
    mall_category_name: {
        type: String,
    },
    image: {
        type: String,
    },
    sort: {
        type: Number,
    },
    level: {
        type: String,
        default: 'level2'
    },
}) 

mongoose.model("CategorySub", categorySubShema)   