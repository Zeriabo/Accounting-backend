const ledgerService = require("../service/LedgerService");
const ledgerServiceInstance = new ledgerService();
const AssetService = require("../service/AssetsService");
const assetServiceInstance = new AssetService();
const Ledger = require("../Models/ledger");
const AssetController = require("./AssetController");

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

    ba.dname = doc1.debit;
    ba.cname = doc1.credit;
    ba.daccNo = doc1.daccNo;
    ba.caccNo = doc1.caccNo;
    ba.dvalue = doc1.dvalue;
    ba.cvalue = doc1.cvalue;

    let ledgerdoc = new Ledger(doc1);
    try {
      //creditModel, debitModel, ledgerModel)
      const registered = await ledgerServiceInstance.registerLedger(
        da,
        ma,
        ba,
        ledgerdoc
      );

      if (registered.success) {
        console.log("success");
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getLedgers() {
    return ledgerServiceInstance.getAll();
  }
}
module.exports = LedgerController;
