const express = require("express");
const router = express.Router();

let led = require("../Models/ledger");

router.route("/savedata").post((req, res, next) => {
  led.create(req.body, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      console.log(data);
      res.json(data);
      res.send("item has been saved");
    }
  });
});

module.exports = router;
