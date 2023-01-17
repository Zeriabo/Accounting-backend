const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var liabilitiesSchema = new Schema(
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
    collection: "Liabilities",
  }
);
const liabilities = mongoose.model("Liabilities", liabilitiesSchema);
module.exports = liabilities;
