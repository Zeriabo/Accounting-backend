const mongoose = require("mongoose");
const { Schema } = mongoose;
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
var Account = mongoose.model("Accounts", accountSchema);
module.exports = Account;
