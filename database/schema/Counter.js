const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// id自增表接口
const counterSchema = new Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 },
});

counterSchema.statics.getNextSequenceValue = async function (sequenceName) {
  const sequenceDocument = await this.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

module.exports = mongoose.model("Counter", counterSchema);