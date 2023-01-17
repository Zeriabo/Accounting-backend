const ledgerService = require("../service/LedgerService");
const ledgerServiceInstance = new ledgerService();
const AssetService = require("../service/AssetsService");
const assetServiceInstance = new AssetService();
let asset = require("../Models/asset");
let liabilities = require("../Models/accounts");
let shareholderEquity = require("../Models/accounts");
let credit = require("../Models/accounts");
let debit = require("../Models/accounts");
let balancesheet = require("../Models/balancesheet");
let led = require("../Models/ledger");
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
    console.log(doc1);
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
      const registered = await ledgerServiceInstance.registerLedger(doc1);

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
          var assetDebit = new asset(ma);
          var debitAmount = new debit(ma);
          var liabilityCredit = new liabilities(da);
          var creditAmount = new credit(da);
          var balanceSheet = new balancesheet(ba);
        } else if (
          [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.daccNo) &&
          [300, 311, 320, 330, 332, 350, 360].includes(doc1.caccNo)
        ) {
          var assetDebit = new asset(ma);
          var debitAmount = new debit(ma);
          var liabilityCredit = new shareholderEquity(da);
          var creditAmount = new credit(da);
          var balanceSheet = new balancesheet(ba);
        } else if (
          [300, 311, 320, 330, 332, 350, 360].includes(doc1.daccNo) &&
          [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.caccNo)
        ) {
          var assetDebit = new asset(ma);
          var debitAmount = new debit(ma);
          var liabilityCredit = new liabilities(da);
          var creditAmount = new credit(da);
          var balanceSheet = new balancesheet(ba);
        }

        // await assetDebit.save();
        // await debitAmount.save();
        // await liabilityCredit.save();
        // await creditAmount.save();
        // await balanceSheet.save();
        const assetToUpdate = await assetServiceInstance.updateAsset(
          assetDebit
        );
        return assetToUpdate.success;
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
