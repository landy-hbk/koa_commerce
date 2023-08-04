const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter')

const RoleSchema = new Schema({
    // 自增id
    role_id: {
        unique: true,
        type: Number,
    },
    // 角色名称
    role_name: {
        type: String,
        require: true,
    },
    // 描述
    describe: {
        type: String,
        default: '',
    },
    role_trees: {
        type: [Schema.Types.Mixed],
        default: null,
    },
    status: {
        type: Number,
        default: 1,
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


RoleSchema.pre("save", async function (next) {
    const role = this;
    if (!role.isNew || role.role_id) {
      return next();
    }
    try {
      if (!role.role_id) {
        role.role_id = await Counter.getNextSequenceValue("role_id"); // rid是你需要自增的属性
      }
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('Role', RoleSchema) 