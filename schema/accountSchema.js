const Schema = mongoose.Schema;

export const accountSchema = new Schema({
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
