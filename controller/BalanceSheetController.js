let asset = require("../Models/asset");
const balanceSheetervice = require("../service/BalanceSheetService");
const balanceSheetServiceInstance = new balanceSheetervice();

const getBalanceSheet = async (req, res, next) => {
  const balance = await balanceSheetServiceInstance.getAll();
  if (balance.length > 0) {
    return balance;
  } else {
    throw new Error(balance.error);
  }
};
module.exports = {
  getBalanceSheet,
};
