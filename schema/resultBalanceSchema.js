const Schema = mongoose.Schema;
export const ResultBalanceSchema = new Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
  },
});
