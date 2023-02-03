const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var BalanceSchema = new Schema(
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
  },
  {
    collection: "Balancesheet",
  }
);
module.exports = mongoose.model("Balancesheet", BalanceSchema);
