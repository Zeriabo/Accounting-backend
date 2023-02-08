let ledgerModel = require("../Models/ledger");
let asset = require("../Models/asset");
let liabilities = require("../Models/liabilities");
let shareholderEquity = require("../Models/ShareholdersEquity");
let credit = require("../Models/credit");
let debit = require("../Models/debit");
let balancesheet = require("../Models/balancesheet");
const balanceSheetervice = require("../service/BalanceSheetService");
const creditService = require("../service/CreditService");
const liabilityService = require("../service/LiabilityService");
const debitService = require("../service/debitService");
const assetService = require("../service/AssetsService");
const shareHolderEquityService = require("../service/ShareHoldersEquityService");

const balanceSheetServiceInstance = new balanceSheetervice();
const creditServiceInstance = new creditService();
const liabilityServiceInstance = new liabilityService();
const debitServiceInstance = new debitService();
const assetServiceInstance = new assetService();
const shareholderEquityInstance = new shareHolderEquityService();

class LedgerService {
  constructor() {}
  async getAll() {
    try {
      const result = await ledgerModel.find({});

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async registerLedger(creditModel, debitModel, balanceModel, ledgerModel) {
    try {
      if (
        ([101, 102, 108, 110, 112, 116, 130, 157, 158].includes(
          ledgerModel.daccNo
        ) ||
          [200, 201, 209, 230, 231].includes(ledgerModel.daccNo)) &&
        ([101, 102, 108, 110, 112, 116, 130, 157, 158].includes(
          ledgerModel.caccNo
        ) ||
          [200, 201, 209, 230, 231].includes(ledgerModel.caccNo))
      ) {
        var assetDebit = new asset(debitModel);
        var debitAmount = new debit(debitModel);
        var liabilityCredit = new liabilities(creditModel);
        var creditAmount = new credit(creditModel);
        var balanceSheet = new balancesheet(balanceModel);
      } else if (
        [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(
          ledgerModel.daccNo
        ) &&
        [300, 311, 320, 330, 332, 350, 360].includes(ledgerModel.caccNo)
      ) {
        var assetDebit = new asset(debitModel);
        var debitAmount = new debit(debitModel);
        var shareholderEquity = new shareholderEquity(creditModel);
        var creditAmount = new credit(creditModel);
        var balanceSheet = new balancesheet(balanceModel);
      } else if (
        [300, 311, 320, 330, 332, 350, 360].includes(ledgerModel.daccNo) &&
        [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(
          ledgerModel.caccNo
        )
      ) {
        var assetDebit = new asset(debitModel);
        var debitAmount = new debit(debitModel);
        var liabilityCredit = new liabilities(creditModel);
        var creditAmount = new credit(creditModel);
        var balanceSheet = new balancesheet(balanceModel);
      }

      //updating assets
      await assetServiceInstance.save(assetDebit);
      //  await debitAmount.save();
      await debitServiceInstance.save(debitAmount); //must add the debit or update
      //await liabilityCredit.save();
      if (liabilityCredit) {
        await liabilityServiceInstance.save(liabilityCredit); //must add the liability or update
      }
      if (shareholderEquity) {
        await shareholderEquityInstance.save(shareholderEquity);
      }
      //credit amount save
      await creditServiceInstance.save(creditAmount);

      //Balancesheet save
      await balanceSheetServiceInstance.updateBalanceSheet(balanceModel); //check

      await this.updateLedger(ledgerModel);

      return { success: true, body: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async updateLedger(ledger) {
    try {
      const debitFound = await ledgerModel.find({ daccNo: ledger.daccNo });
      const creditFound = await ledgerModel.find({ caccNo: ledger.caccNo });
      if (debitFound.length == 0 && creditFound.length == 0) {
        return ledger.save();
      }
      if (debitFound.length > 0 && creditFound.length == 0) {
        ledgerModel.updateOne(
          { daccNo: ledger.daccNo },
          { $inc: { dvalue: ledger.dvalue } }
        );
        let credit = {};
        credit.caccNo = ledger.caccNo;
        credit.cvalue = ledger.cvalue;
        credit.cname = ledger.cname;
        const result = ledger.save(credit);
        return { success: true, body: result };
      }
      if (creditFound.length > 0 && debitFound.length == 0) {
        ledgerModel.updateOne(
          { caccNo: ledger.caccNo },
          { $inc: { cvalue: ledger.cvalue } }
        );
        return { success: true, body: result };
      }
      if (creditFound.length > 0 && debitFound.length > 0) {
        const update1 = ledgerModel.findOneAndUpdate(
          { caccNo: ledger.caccNo },
          { $inc: { dvalue: ledger.dvalue } },
          function (err, updated) {
            if (err) {
              console.log(err);
              res.json(err);
            } else {
              console.log(updated);
            }
          }
        );
        const update2 = ledgerModel.findOneAndUpdate(
          { daccNo: ledger.daccNo },
          { $inc: { cvalue: ledger.cvalue } },
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

module.exports = LedgerService;
