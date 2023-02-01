let asset = require("../Models/asset");
const balanceSheetervice = require("../service/BalanceSheetService");
const balanceSheetServiceInstance = new balanceSheetervice();
class BalanceSheetController {
  constructor() {}
  async getBalanceSheet() {
    return balanceSheetServiceInstance.getAll();
  }
}
module.exports = BalanceSheetController;
