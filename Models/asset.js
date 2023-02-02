const mongoose = require("mongoose");
const assetSchema = mongoose.Schema;

var Asset = new assetSchema(
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
    collection: "Assets",
  }
);
var Asset = mongoose.model("Asset", Asset);
module.exports = Asset;
