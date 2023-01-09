module.exports = {
  //"mongodb://localhost:27017/Accounting"
  db:
    "mongodb+srv://zeriab:" +
    process.env.DB_PASSWORD +
    "@accounting.dfuow.gcp.mongodb.net/Accounting?retryWrites=true&w=majority",
};
