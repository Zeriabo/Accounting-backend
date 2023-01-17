const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var creditSchema = new Schema(
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
    collection: "Credit",
  }
);
const credit = mongoose.model("Credit", assetSchema);
module.exports = credit;
