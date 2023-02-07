const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var shareHoldersEquitySchema = new Schema(
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
    collection: "ShareholdersEquity",
  }
);
const shareHoldersEq =
  mongoose.models.ShareholdersEquity ||
  mongoose.model("ShareholdersEquity", shareHoldersEquitySchema);
module.exports = shareHoldersEq;
