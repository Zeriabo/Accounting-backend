const mongoose = require("mongoose");
const ledgerSchema = mongoose.Schema;

var Ledger = new ledgerSchema(
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
    collection: "Ledger",
  }
);
var Ledger = mongoose.model("Ledger", Ledger);
module.exports = Ledger;
