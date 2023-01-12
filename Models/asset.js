const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var assetSchema = new Schema(
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
const asset = mongoose.model("Assets", assetSchema);
module.exports = asset;
