let ledgerModel = require("../Models/ledger");

class LedgerService {
  constructor() {
    // Create instance of Data Access layer using our desired model
    // this.MongooseServiceInstance = new MongooseService(ledgerModel);
  }
  async getAll() {
    try {
      const result = await ledgerModel.find({});

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async registerLedger(ledgerToCreate) {
    try {
      const result = await ledgerModel.create(ledgerToCreate);

      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
module.exports = LedgerService;
// const registerLedger = async (ledger) => {
//   const created = await led.create(ledger, (error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       return true;
//     }
//   });
// };

// module.exports = { registerLedger };
