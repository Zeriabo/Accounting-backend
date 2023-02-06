const mongoose = require("mongoose");
const balanceSchema = mongoose.Schema;
var BalanceSchema = new balanceSchema(
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
    collection: "Balancesheet",
  }
);
module.exports = mongoose.model("Balancesheet", BalanceSchema);
