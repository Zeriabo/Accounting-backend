import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const balanceSchema = new Schema({
  accNo: {
    type: Number,
  },
  mvalue: {
    type: Number,
  },
  dvalue: {
    type: Number,
  },
});
module.exports = router;
