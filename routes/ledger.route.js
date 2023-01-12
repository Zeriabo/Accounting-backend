const express = require("express");
const router = express.Router();
const LedgerController = require("../controller/LedgerController");
const ledgerController = new LedgerController();
let led = require("../Models/ledger");

router.route("/savedata").post((req, res) => {
  const created = ledgerController.createLedger(req.body);

  created
    .then((ledger) => {
      res.send(ledger);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.route("/").get(async (req, res) => {
  const ledgers = ledgerController.getLedgers();

  ledgers
    .then((ledger) => {
      res.send(ledger);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
module.exports = router;
