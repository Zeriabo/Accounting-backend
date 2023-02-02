const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BalanceSheetController = require("../controller/BalanceSheetController");
let BalanceSchema = require("../Models/balancesheet");
const Schema = mongoose.Schema;
router.route("/create-balance").post((req, res, next) => {
  BalanceSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});
router.route("/").get(async (req, res, next) => {
  const data = await BalanceSheetController.getBalanceSheet(req.body);
  res.send(data);
});

new Schema({
  mname: {
    type: String,
  },
  dname: {
    type: String,
  },
  maccNo: {
    type: Number,
  },
  daccNo: {
    type: Number,
  },
  mvalue: {
    type: Number,
  },
  dvalue: {
    type: Number,
  },
});
module.exports = router;
