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

      //await assetDebit.save();
      await assetServiceInstance.save(assetDebit);
      //  await debitAmount.save();
      await debitServiceInstance.save(debitAmount);
      //await liabilityCredit.save();
      if (liabilityCredit) {
        await liabilityServiceInstance.save(liabilityCredit);
      }
      if (shareholderEquity) {
        await shareholderEquityInstance.save(shareholderEquity);
      }
      //credit amount save
      await creditServiceInstance.save(creditAmount);

      //Balancesheet save
      await balanceSheetServiceInstance.updateBalanceSheet(balanceSheet); //check

      // await ledgerModel.save(ledgerModel);

      return { success: true, body: assetToUpdate.success };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}

module.exports = LedgerService;
