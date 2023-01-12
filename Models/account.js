const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var accountSchema = new Schema({
  name: {
    type: String,
  },
  accNo: {
    type: Number,
  },
  value: {
    type: Number,
  },
});
var Account = mongoose.model("account", accountSchema);
module.exports = Account;
