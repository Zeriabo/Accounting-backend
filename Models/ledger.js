const mongoose = require("mongoose");
const ledgerSchema = mongoose.Schema;

var Ledger = new ledgerSchema(
  {
    dname: {
      type: String,
    },
    cname: {
      type: String,
    },
    daccNo: {
      type: Number,
    },
    caccNo: {
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
    collection: "Ledger",
  }
);
var Ledger = mongoose.model("Ledger", Ledger);
module.exports = Ledger;
