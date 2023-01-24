const express = require("express");
const router = express.Router();
const LedgerController = require("../controller/LedgerController");
const ledgerController = new LedgerController();
let led = require("../Models/ledger");

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
      res.send(ledger);t
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
