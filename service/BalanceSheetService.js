let BalanceSheetModel = require("../Models/balancesheet");

class BalanceSheetService {
  constructor() {}
  async getAll() {
    try {
      const result = await BalanceSheetModel.aggregate(
        [
          {
            $project: {
              _id: "$accNo",
              value: "$value",
              name: "$name",
              accNo: "$accNo",
            },
          },
        ],
        (err, book) => {
          if (err) {
            return { success: false, error: err };
          } else if (book.length == 0) {
            return { success: true, data: [] };
          } else {
            return { success: true, data: book };
          }
        }
      );
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = BalanceSheetService;
