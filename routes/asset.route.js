const express = require("express");
const router = express.Router();
const assetsController = require("../controller/AssetController");
const assetController = new assetsController();

router.route("/").get(async (req, res) => {
  const assets = assetController.selectAssets();
  const result = await assets;
  assets
    .then((assets) => {
      res.send(assets);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
