const mongoose = require("mongoose");
const creditSchema = mongoose.Schema;

var Credit = new creditSchema(
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
var Credit = mongoose.model("Credit", Credit);
module.exports = Credit;
