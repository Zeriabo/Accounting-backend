let asset = require("../Models/asset");
const assetService = require("../service/AssetsService");
const assetServiceInstance = new assetService();
class AssetController {
  constructor() {}
  async selectAssets() {
    return assetServiceInstance.getAll();
  }
}
module.exports = AssetController;
