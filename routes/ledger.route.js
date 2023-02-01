const express = require("express");
const router = express.Router();
const LedgerController = require("../controller/LedgerController");
const ledgerController = new LedgerController();

router.route("/savedata").post((req, res) => {
  try {
    return ledgerController.createLedger(req.body.data);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.route("/").get(async (req, res) => {
  const ledgers = ledgerController.getLedgers();
  ledgers
    .then((ledger) => {
      res.status(200).send(ledger);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
