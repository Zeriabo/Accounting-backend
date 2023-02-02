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
    value: {
      type: Number,
    },
  },
  {
    collection: "Balancesheet",
  }
);
module.exports = mongoose.model("Balancesheet", BalanceSchema);
