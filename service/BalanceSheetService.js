const mongoose = require("mongoose");
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

let BalanceSheetModel = require("../Models/balancesheet");

class BalanceSheetService {
  constructor() {}
  async getAll() {
    try {
      const result = await BalanceSheetModel.aggregate(
        [
          {
            $project: {
              _id: "$accNo",
              dvalue: "$dvalue",
              cvalue: "$cvalue",
              name: "$name",
              accNo: "$accNo",
            },
          },
        ],
        (err, book) => {
          if (err) {
            return { success: false, error: err };
          } else if (book.length == 0) {
            return { success: true, data: [] };
          } else {
            return { success: true, data: book };
          }
        }
      );
      return result;
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async initializeData() {
    await asmodel.deleteMany({});
    await ledgerModel.deleteMany({});
    await shmodel.deleteMany({});
    await cmodel.deleteMany({});
    await dmodel.deleteMany({});
    await bmodel.deleteMany({});

    const init = {
      name: "Bank/Cash at Bank",
      accNo: 101,
      dvalue: 1000000,
      cvalue: 0,
    };
    const init2 = {
      name: "Owner Capital",
      accNo: 300,
      cvalue: 1000000,
      dvalue: 0,
    };
    const init2b = { accNo: 300, cvalue: 1000000, dvalue: 0 };
    const initb = { accNo: 101, dvalue: 1000000, cvalue: 0 };
    const binit = {
      name: "Bank/Cash at Bank",
      accNo: 101,
      dvalue: 1000000,
      cvalue: 0,
    };
    const binit2 = {
      name: "Owner Capital",
      accNo: 300,
      cvalue: 1000000,
      dvalue: 0,
    };
    var shareholderInit = new shmodel(init2);
    shareholderInit.save(function (err, d) {
      if (err) console(err);
      else console.log(d);
    });
    var abl = new bmodel(binit);
    var abl2 = new bmodel(binit2);
    abl.save(function (err, d) {
      if (err) console(err);
      else console.log(d);
    });
    abl2.save(function (err, d) {
      if (err) console(err);
      else console.log(d);
    });
    var as = new asmodel(init);
    as.save(function (err, d) {
      if (err) console(err);
      else console.log(d);
    });
  }
}
module.exports = BalanceSheetService;
