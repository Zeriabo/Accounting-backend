import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const ResultBalance_Schema = new Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
  },
});
module.exports = router;
