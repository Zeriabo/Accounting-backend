import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const balanceSchema = new Schema({
  name: {
    type: String,
  },
  accNo: {
    type: Number,
  },
  mvalue: {
    type: Number,
  },
  dvalue: {
    type: Number,
  },
  value: {
    type: Number,
  },
});
module.exports = router;
