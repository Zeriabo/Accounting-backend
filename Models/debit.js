const mongoose = require("mongoose");
const debitSchema = mongoose.Schema;

var Debit = new debitSchema(
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
var Debit = mongoose.model("Debit", Debit);
module.exports = Debit;
