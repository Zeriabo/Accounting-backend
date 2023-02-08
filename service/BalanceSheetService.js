const mongoose = require("mongoose");

var cmodel = mongoose.model("Credit");
var dmodel = mongoose.model("Debit");
var asmodel = mongoose.model("Asset");
var bmodel = mongoose.model("Balancesheet");
var ledgerModel = mongoose.model("Ledger");

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
              value: "$value",
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
      value: 1000000,
    };
    const binit2 = {
      name: "Owner Capital",
      accNo: 300,
      cvalue: 1000000,
      dvalue: 0,
      value: 1000000,
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
      const debitFound = await bmodel.find({ accNo: balance.daccNo });
      const creditFound = await bmodel.find({ accNo: balance.caccNo });
      console.log(debitFound);
      console.log(balance);
      console.log(creditFound.length);
      if (debitFound.length == 0 && creditFound.length == 0) {
        return balance.save();
      }
      if (debitFound.length > 0 && creditFound.length == 0) {
        balance.updateOne(
          { accNo: balance.daccNo },
          { $inc: { dvalue: balance.dvalue } }
        );
        let credit = {};
        updateBalanceSheet;
        credit.caccNo = balance.caccNo;
        credit.cvalue = balance.cvalue;
        credit.cname = balance.cname;
        const result = balance.save(credit);
        return { success: true, body: result };
      }
      if (creditFound.length > 0 && debitFound.length == 0) {
        balance.updateOne(
          { accNo: balance.caccNo },
          { $inc: { cvalue: balance.cvalue } }
        );
        return { success: true, body: result };
      }
      if (creditFound.length > 0 && debitFound.length > 0) {
        const update1 = bmodel.findOneAndUpdate(
          { accNo: balance.caccNo },
          { $inc: { dvalue: balance.dvalue } },
          function (err, updated) {
            if (err) {
              console.log(err);
              res.json(err);
            } else {
              console.log(updated);
            }
          }
        );
        const update2 = bmodel.findOneAndUpdate(
          { accNo: balance.daccNo },
          { $inc: { cvalue: balance.cvalue } },
          function (err, updated) {
            if (err) {
              console.log(err);
              res.json(err);
            } else {
              console.log(updated);
            }
          }
        );
        console.log(update1, update2);
        return { success: true, body: true };
      }
      if (debitFound) {
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = BalanceSheetService;
