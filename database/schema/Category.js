const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    id: {
        unique: true,
        type: String,
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

mongoose.model('Category', CategorySchema) 