import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ledgerSchema = new Schema({
  mname: {
    type: String,
  },
  dname: {
    type: String,
  },
  maccNo: {
    type: Number,
  },
  daccNo: {
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
