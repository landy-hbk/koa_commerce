const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter')

// 菜单表接口
const MenuSchema = new Schema({
    menu_id: {
        unique: true,
        type: Number,
    },
    menu_name: {
        type: String,
        require: true,
    },
    menu_path: {
        type: String,
        require: true,
        default: '',
    },
    component: {
        type: String,
        default: '',
    },
    parent_id: {
        type: Number,
    },
    parent_ids_string: {
        type: String,
    },
    sort: {
        type: Number,
    },
    createTime: {
        type: Date,
        default: new Date(),
    },
    updateTime: {
        type: Date,
        default: null,
    }
})


MenuSchema.pre("save", async function (next) {
    const role = this;
    if (!role.isNew || role.menu_id) {
      return next();
    }
    try {
      if (!role.menu_id) {
        role.menu_id = await Counter.getNextSequenceValue("menu_id"); // rid是你需要自增的属性
      }
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('Menu', MenuSchema) 