let assetModel = require("../Models/asset");

class AssetsService {
  constructor() {}

  async getAll() {
    try {
      const result = await assetModel.find();

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = AssetsService;
