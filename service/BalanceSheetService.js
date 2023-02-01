let BalanceSheetModel = require("../Models/balancesheet");

class BalanceSheetService {
  constructor() {}
  async getAll() {
    try {
      const result = await BalanceSheetModel.find({});

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = BalanceSheetService;
