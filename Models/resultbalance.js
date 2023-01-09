const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var resultbalanceSchema = new Schema(
  {
    name: {
      type: String,
    },
    value: {
      type: Number,
    },
  },
  {
    collection: "balancesheetresult",
  }
);
module.exports = mongoose.model("resultbalance", resultbalanceSchema);
