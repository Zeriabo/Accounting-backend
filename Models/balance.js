const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var BalanceSchema = new Schema(
  {
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
  },
  {
    collection: "Balancesheet",
  }
);
module.exports = mongoose.model("balance", BalanceSchema);
