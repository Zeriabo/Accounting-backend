let shareholdersEquityModel = require("../Models/shareholdersEquity");

class ShareHoldersEquityService {
  constructor() {}

  async find(accNo) {
    try {
      const result = await shareholdersEquityModel.find({ accNo });
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async getAll() {
    try {
      const result = await shareholdersEquityModel.find();

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async save(shareholdersEquity) {
    try {
      const found = await shareholdersEquityModel.findOne({
        accNo: shareholdersEquity.accNo,
      });
      if (!found) {
        const result = await shareholdersEquityModel.save(liabilty);
        return { success: true, body: result };
      } else {
        const result = await shareholdersEquityModel.updateOne(
          { accNo: liabilty.accNo },
          { $inc: { value: liabilty.value } }
        );
        return { success: true, body: result };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async updateliabilty(shareholdersEquity) {
    try {
      const result = await shareholdersEquityModel.updateOne(
        { accNo: shareholdersEquity.accNo },
        { $inc: { value: shareholdersEquity.value } }
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = ShareHoldersEquityService;
