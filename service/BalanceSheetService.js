const mongoose = require("mongoose");

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
  async updateBalanceSheet(balance) {
    try {
      const debitFound = await balance.find({ daccNo: balance.daccNo });
      const creditFound = await balance.find({ caccNo: balance.caccNo });
      if (!debitFound && !creditFound) {
        return balance.save();
      }
      //if debit found and credit not
      // if credit found and debit not
      //if both not found
      // if both found
      if (debitFound && !creditFound) {
        balance.updateOne(
          { daccNo: balance.daccNo },
          { $inc: { dvalue: balance.dvalue } }
        );
        let credit = {};
        credit.caccNo = balance.caccNo;
        credit.cvalue = balance.cvalue;
        credit.cname = balance.cname;
        const result = balance.save(credit);
        return { success: true, body: result };
      }
      if (creditFound && !debitFound) {
        balance.updateOne(
          { caccNo: balance.caccNo },
          { $inc: { cvalue: balance.cvalue } }
        );
        return { success: true, body: result };
      }
      if (!creditFound && !debitFound) {
      }
      if (creditFound && debitFound) {
      }
      if (debitFound) {
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = BalanceSheetService;
