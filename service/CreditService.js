let creditModel = require("../Models/credit");

class CreditService {
  constructor() {}

  async find(accNo) {
    try {
      const result = await creditModel.find({ accNo });
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async getAll() {
    try {
      const result = await creditModel.find();

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async save(credit) {
    try {
      const found = await creditModel.find({ accNo: credit.accNo });
      if (found) {
        const updated = await creditModel.updateOne(
          { accNo: credit.accNo },
          { $inc: { value: credit.value } }
        );
        console.log(updated);
      } else {
        await creditModel.save(credit);
      }
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async updateCredit(credit) {
    try {
      const result = await creditModel.updateOne(
        { accNo: credit.accNo },
        { $inc: { value: credit.value } }
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = CreditService;
