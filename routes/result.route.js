const express = require("express");
const router = express.Router();

let led = require("../Models/resultbalance");

router.route("/").get((req, res, next) => {});

module.exports = router;
