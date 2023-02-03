let liabiltyModel = require("../Models/liabilities");

class LiabilitiesService {
  constructor() {}

  async find(accNo) {
    try {
      const result = await liabiltyModel.find({ accNo });
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async getAll() {
    try {
      const result = await liabiltyModel.find();

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async save(liabilty) {
    try {
      const result = await liabiltyModel.save(liabilty);
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async updateliabilty(liabilty) {
    try {
      const result = await liabiltyModel.updateOne(
        { accNo: liabilty.accNo },
        { $inc: { value: liabilty.value } }
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = LiabilitiesService;
