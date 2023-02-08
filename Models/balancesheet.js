const mongoose = require("mongoose");
const balanceSchema = mongoose.Schema;
var BalanceSchema = new balanceSchema(
  {
    name: {
      type: String,
    },
    accNo: {
      type: Number,
    },
    dvalue: {
      type: Number,
    },
    cvalue: {
      type: Number,
    },
    value: {
      type: Number,
    },
  },
  {
    collection: "Balancesheet",
  }
);
module.exports = mongoose.model("Balancesheet", BalanceSchema);
