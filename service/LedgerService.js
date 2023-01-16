let ledgerModel = require("../Models/ledger");

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
  async registerLedger(creditModel, debitModel, ledger) {
    try {
      creditModel.save(function (err) {
        if (err) console(err);
      });
      debitModel.save(function (err) {
        if (err) console(err);
      });
      ledger.save(function (err) {
        if (err) console(err);
      });
      // const result = await ledgerModel.create(ledgerToCreate);

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
const registerLedger = async (ledger) => {};
module.exports = LedgerService;

// module.exports = { registerLedger };
