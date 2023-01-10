const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let BalanceSchema = require("../Models/balance");
const Schema = mongoose.Schema;
router.route("/create-balance").post((req, res, next) => {
  BalanceSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

new Schema({
  mname: {
    type: String,
  },
  dname: {
    type: String,
  },
  maccNo: {
    type: Number,
  },
  daccNo: {
    type: Number,
  },
  mvalue: {
    type: Number,
  },
  dvalue: {
    type: Number,
  },
});
module.exports = router;
