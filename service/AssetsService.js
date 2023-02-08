let assetModel = require("../Models/asset");

class AssetsService {
  constructor() {}

  async find(accNo) {
    try {
      const result = await assetModel.find({ accNo });
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async getAll() {
    try {
      const result = await assetModel.find();

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async save(asset) {
    try {
      const found = await assetModel.find({ accNo: asset.accNo });
      console.log(found);
      if (found.length == 0) {
        const result = await asset.save();
        return { success: true, body: result };
      } else {
        const result = await assetModel.updateOne(
          { accNo: asset.accNo },
          { $inc: { value: asset.value } }
        );
        return { success: true, body: result };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async updateAsset(asset) {
    try {
      const result = await assetModel.updateOne(
        { accNo: asset.accNo },
        { $inc: { value: asset.value } }
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = AssetsService;
