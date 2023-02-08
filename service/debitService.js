let debitModel = require("../Models/debit");

class DebitService {
  constructor() {}

  async find(accNo) {
    try {
      const result = await debitModel.find({ accNo });
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async getAll() {
    try {
      const result = await debitModel.find();

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async save(debit) {
    try {
      const found = await debitModel.find({ accNo: debit.accNo });
      if (found.length > 0) {
        await debitModel.updateOne(
          { accNo: debit.accNo },
          { $inc: { value: debit.value } }
        );
      } else {
        await debit.save();
      }

      return { success: true, body: debit };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async updatedebit(debit) {
    try {
      const result = await debitModel.updateOne(
        { accNo: debit.accNo },
        { $inc: { value: debit.value } }
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = DebitService;
