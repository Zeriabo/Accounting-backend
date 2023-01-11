const ledgerService = require("../service/LedgerService");
const ledgerServiceInstance = new ledgerService();

let asset = require("../Models/account");
let liabilities = require("../Models/account");
let shareholderEquity = require("../Models/account");
let credit = require("../Models/account");
let debit = require("../Models/account");
let balancesheet = require("../Models/balance");

class LedgerController {
  constructor() {}

  async createLedger(ledger) {
    const doc1 = {
      credit: ledger.credit,
      debit: ledger.debit,
      caccNo: ledger.cAccNo,
      daccNo: ledger.dAccNo,
      dvalue: ledger.dvalue,
      cvalue: ledger.cvalue,
    };
    const DD = "Debit";
    const CC = "Credit";
    const ma = {};
    const da = {};
    const ba = {};
    ma.name = doc1.debit;
    ma.accNo = doc1.daccNo;
    ma.value = doc1.dvalue;

    da.name = doc1.credit;
    da.accNo = doc1.caccNo;
    da.value = doc1.cvalue;

    ba.mname = doc1.debit;
    ba.dname = doc1.credit;
    ba.maccNo = doc1.daccNo;
    ba.daccNo = doc1.caccNo;
    ba.mvalue = doc1.dvalue;
    ba.dvalue = doc1.cvalue;

    try {
      const registered = await ledgerServiceInstance.registerLedger(ledger);

      if (registered.success) {
        if (
          ([101, 102, 108, 110, 112, 116, 130, 157, 158].includes(
            doc1.daccNo
          ) ||
            [200, 201, 209, 230, 231].includes(doc1.daccNo)) &&
          ([101, 102, 108, 110, 112, 116, 130, 157, 158].includes(
            doc1.caccNo
          ) ||
            [200, 201, 209, 230, 231].includes(doc1.caccNo))
        ) {
          var mod = new asset(ma);
          var bod = new debit(ma);
          var dod = new liabilities(da);
          var cod = new credit(da);
          var aod = new balancesheet(ba);
          var le = new led(ba);
        } else if (
          [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.daccNo) &&
          [300, 311, 320, 330, 332, 350, 360].includes(doc1.caccNo)
        ) {
          var mod = new asset(ma);
          var bod = new debit(ma);
          var dod = new shareholderEquity(da);
          var cod = new credit(da);
          var aod = new balancesheet(ba);
          var le = new led(ba);
        } else if (
          [300, 311, 320, 330, 332, 350, 360].includes(doc1.daccNo) &&
          [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.caccNo)
        ) {
          var mod = new asset(ma);
          var bod = new debit(ma);
          var dod = new liabilities(da);
          var cod = new credit(da);
          var aod = new balancesheet(ba);
        }
        mod.create(req.body, (error, data) => {
          if (error) {
            return next(error);
          } else {
            bod.create();
            dod.create();
            cod.create();
            aod.create();
          }
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
module.exports = LedgerController;
