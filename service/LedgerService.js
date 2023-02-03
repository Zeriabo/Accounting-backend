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

const balanceSheetServiceInstance = new balanceSheetervice();
const creditServiceInstance = new creditService();
const liabilityServiceInstance = new liabilityService();
const debitServiceInstance = new debitService();
const assetServiceInstance = new assetService();

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
        var liabilityCredit = new shareholderEquity(creditModel);
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

      //await assetDebit.save();
      const assetToUpdate = await assetServiceInstance.save(assetDebit);
      //  await debitAmount.save();
      const debitToUpdate = await debitServiceInstance.save(debitAmount);
      //await liabilityCredit.save();
      const liabilityToUpdate = await liabilityServiceInstance.save(assetDebit);
      //await creditAmount.save();
      const creditToUpdate = await creditServiceInstance.save(assetDebit);
      //await balanceSheet.save();
      const balancesheetToUpdate = await balanceSheetServiceInstance.updateBalanceSheet(
        balanceSheet
      );

      // creditModel.save(function (err) {
      //   if (err) console(err);
      // });
      // debitModel.save(function (err) {
      //   if (err) console(err);
      // });
      // balanceModel.save(function (err) {
      //   if (err) console(err);
      // });
      ledgerModel.save(function (err) {
        if (err) console(err);
      });

      return { success: true, body: assetToUpdate.success };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}

module.exports = LedgerService;
