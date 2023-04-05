/* eslint @typescript-eslint/no-var-requires: "off" */
const express = require("express");
const mongoose = require("mongoose");
// import lusca from 'lusca' will be usedç later
const dotenv = require("dotenv");
const path = require("path");
const { fileURLToPath } = require("url");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const ledgerRouter = require("./routes/ledger.route");
const balancesheetRouter = require("./routes/balancesheet.route");
const result = require("./routes/result.route");
const assetsRouter = require("./routes/asset.route");
let bodyParser = require("body-parser");
let ledgerModel = require("./Models/ledger");
let assetsModel = require("./Models/asset");
let balanceModel = require("./Models/balancesheet");
let account = require("./Models/accounts");
let liabilities = require("./Models/liabilities");
let shareholderEquity = require("./Models/ShareholdersEquity");

dotenv.config({ path: ".env" });

const app = express();

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];


app.use(cors());


const port = process.env.PORT || 5001;

const env = process.env;

app.options("*", cors());
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.set("view engine", "pug");

// Express configuration
app.set("port", port);

// Global middleware
app.use(express.json());
app.use(cookieParser());
app.listen(port, () => console.log(`Listening on port ${port}`));

// Set up routers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/api/v1/ledger", ledgerRouter);
app.use("/api/v1/balancesheet", balancesheetRouter);
app.use("/api/v1/result", result);
app.use("/api/v1/assets", assetsRouter);

let dbConfig = require("./database/db");

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database  " + dbConfig.db, " sucessfully connected!");
    },
    (error) => {
      console.log("Could not connect to database : " + error);
    }
  );

mongoose.set("useFindAndModify", false);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/intializedata", async function (req, res) {
  await ledgerModel.deleteMany({});
  await assetsModel.deleteMany({});
  await account.deleteMany({});
  await liabilities.deleteMany({});
  await shareholderEquity.deleteMany({});
  await balanceModel.deleteMany({});
  const init = { name: "Bank/Cash at Bank", accNo: 101, value: 1000000 };
  const init2 = { name: "Owner Capital", accNo: 300, value: 1000000 };
  const init2b = {
    name: "Owner Capital",
    accNo: 300,
    dvalue: 0,
    cvalue: 1000000,
    value: 1000000,
  };
  const initb = {
    name: "Bank/Cash at Bank",
    accNo: 101,
    dvalue: 1000000,
    cvalue: 0,
    value: 1000000,
  };

  var shareholderInit = new shareholderEquity(init2);
  shareholderInit.save(function (err, d) {
    if (err) console(err);
  });
  var abl = new balanceModel(init2b);
  abl.save(function (err, d) {
    if (err) console(err);
    else console.log(d);
    // saved!
  });
  var ab = new balanceModel(initb);
  ab.save(function (err, d) {
    if (err) console(err);
    else console.log(d);
    // saved!
  });
  var as = new assetsModel(init);
  as.save(function (err, d) {
    if (err) console(err);
  });
});

module.exports = { app };

