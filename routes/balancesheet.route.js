const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BalanceSheetController = require("../controller/BalanceSheetController");
let BalanceSchema = require("../Models/balancesheet");
let AssetSchema = require("../Models/asset");
let LedgerSchema = require("../Models/ledger");
let ShareholderSchema = require("../Models/ShareholdersEquity");
let accountSchema = require("../Models/accounts");
let debitSchema = require("../Models/debit");
let creditSchema = require("../Models/credit");

var cmodel = mongoose.model("Credit");
var dmodel = mongoose.model("Debit");
var asmodel = mongoose.model("Asset");
var bmodel = mongoose.model("Balancesheet");
var ledgerModel = mongoose.model("Ledger");

var shmodel = mongoose.model("ShareholdersEquity");

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
router.route("/intializeData").get(async (req, res, next) => {
  await asmodel.deleteMany({});
  await ledgerModel.deleteMany({});
  await shmodel.deleteMany({});
  await cmodel.deleteMany({});
  await dmodel.deleteMany({});
  await bmodel.deleteMany({});
  const init = { name: "Bank/Cash at Bank", accNo: 101, value: 1000000 };
  const init2 = { name: "Owner Capital", accNo: 300, value: 1000000 };
  const init2b = { accNo: 300, mvalue: 0, dvalue: 1000000 };
  const initb = { accNo: 101, mvalue: 1000000, dvalue: 0 };
  const binit = {
    mname: "Bank/Cash at Bank",
    dname: "Owner Capital",
    maccNo: 101,
    daccNo: 300,
    mvalue: 1000000,
    dvalue: 1000000,
  };

  var shareholderInit = new shmodel(init2);
  shareholderInit.save(function (err, d) {
    if (err) console(err);
    else console.log(d);
  });
  var abl = new bmodel(binit);
  abl.save(function (err, d) {
    if (err) console(err);
    else console.log(d);
  });
  var as = new asmodel(init);
  as.save(function (err, d) {
    if (err) console(err);
    else console.log(d);
  });

  res.send(true);
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
