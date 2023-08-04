const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    id: {
        unique: true,
        type: Number,
    },
    level: {
        type: String,
        default: 'level1',
    },
    mall_category_name: {
        type: String,
    },
    image: {
        type: String,
    },
    type: {
        type: Number,
    },
    sort: {
        type: Number,
    },
    comments: {
        type: String,
    }
})

module.exports = mongoose.model('Category', CategorySchema) 