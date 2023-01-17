const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var shareholdersEquitySchema = new Schema(
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
const shareholdersEquity = mongoose.model(
  "ShareholdersEquity",
  shareholdersEquitySchema
);
module.exports = shareholdersEquity;
