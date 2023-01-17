const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var debitSchema = new Schema(
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
    collection: "Debit",
  }
);
const debit = mongoose.model("Debit", assetSchema);
module.exports = debit;
