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
var ledgerRouter = require("./routes/ledger.route");
var balancesheetRouter = require("./routes/balancesheet.route");
var result = require("./routes/result.route");
var assetsRouter = require("./routes/asset.route");
let bodyParser = require("body-parser");
dotenv.config({ path: ".env" });

const app = express();

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

const port = process.env.PORT || 5001;

const env = process.env;
app.use(cors());
app.use(
  session({
    secret: "eminem", // session secret
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24),
    },
  })
);
app.use(express.static("public"));
app.set("view engine", "pug");
//passport.use(googleStrategy)
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

module.exports = { app };

// import express from "express";
// import path from "path";
// var app = express();
// import cors from "cors";
// import bodyParser from "body-parser";
// // import dbConfig from "./database/db";
// import http from "http";

// import rootRoutes from "./routes";
// const router = express.Router();
// app.use(router);
// router.use("/", rootRoutes);

// app.use(cors());
// // Express Route

// // Connecting mongoDB Database
// mongoose.Promise = global.Promise;
// mongoose
//   .connect(dbConfig.db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(
//     () => {
//       console.log("Database  " + dbConfig.db, " sucessfully connected!");
//     },
//     (error) => {
//       console.log("Could not connect to database : " + error);
//     }
//   );

// mongoose.set("useFindAndModify", false);
// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// //app.use('/ledgers', ledgerRoute)
// app.use(cors());
// app.options("*", cors());
// app.use(express.static("public"));
// app.use(bodyParser.json({ limit: "5mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

// const port = process.env.PORT || 4000;

// server.listen(port, () => console.log(`Listening on port ${port}`));

// var lemodel = mongoose.model("Ledger", ledgerSchema, "Ledger");
// var asmodel = mongoose.model("Assets", accountSchema, "Assets");
// var limodel = mongoose.model("Liability", accountSchema, "Liabilities");
// var shmodel = mongoose.model(
//   "ShareholderEquity",
//   accountSchema,
//   "ShareholdersEquity"
// );
// var cmodel = mongoose.model("Credits", accountSchema, "Credit");
// var dmodel = mongoose.model("Debit", accountSchema, "Debit");
// var bmodel = mongoose.model("Balancesheet", balanceSchema, "Balancesheet");
// var revmodel = mongoose.model("Revenues", accountSchema, "Revenues");
// var expmodel = mongoose.model("Expenses", accountSchema, "Expenses");
// var ibmodel = mongoose.model("Incomesheet", balanceSchema, "Incomesheet");

// app.post("/emptydata", async function (re, res) {
//   await lemodel.deleteMany({});
//   await asmodel.deleteMany({});
//   await limodel.deleteMany({});
//   await shmodel.deleteMany({});
//   await cmodel.deleteMany({});
//   await dmodel.deleteMany({});
//   await bmodel.deleteMany({});
//   await revmodel.deleteMany({});
//   await expmodel.deleteMany({});
//   await ibmodel.deleteMany({});
// });

// app.post("/intializeData", async function (req, res) {
//   await lemodel.deleteMany({});
//   await asmodel.deleteMany({});
//   await limodel.deleteMany({});
//   await shmodel.deleteMany({});
//   await cmodel.deleteMany({});
//   await dmodel.deleteMany({});
//   await bmodel.deleteMany({});
//   const init = { name: "Bank/Cash at Bank", accNo: 101, value: 1000000 };
//   const init2 = { name: "Owner Capital", accNo: 300, value: 1000000 };
//   const init2b = { accNo: 300, mvalue: 0, dvalue: 1000000 };
//   const initb = { accNo: 101, mvalue: 1000000, dvalue: 0 };
//   var shareholderInit = new shmodel(init2);
//   shareholderInit.save(function (err, d) {
//     if (err) console(err);
//     else console.log(d);
//   });
//   var abl = new bmodel(init2b);
//   abl.save(function (err, d) {
//     if (err) console(err);
//     else console.log(d);
//     // saved!
//   });
//   var as = new asmodel(init);
//   as.save(function (err, d) {
//     if (err) console(err);
//     else console.log(d);
//   });

//   var ab = new bmodel(initb);
//   ab.save(function (err, d) {
//     if (err) console(err);
//     else console.log(d);
//     // saved!
//   });
// });

// app.post("/savedata", async function (req, res) {
//   var doc1 = {
//     credit: req.body.credit,
//     debit: req.body.debit,
//     caccNo: req.body.cAccNo,
//     daccNo: req.body.dAccNo,
//     dvalue: req.body.dvalue,
//     cvalue: req.body.cvalue,
//   };
//   const data = res.body;

//   //Need to insert to the leger for the Trail balance sheet!!!!!
//   const DD = "Debit";
//   CC = "Credit";
//   var ma = {};
//   var da = {};
//   var ba = {};
//   var bal = {};

//   ma.name = doc1.debit;
//   ma.accNo = doc1.daccNo;
//   ma.value = parseInt(doc1.dvalue);
//   da.name = doc1.credit;
//   da.accNo = doc1.caccNo;
//   da.value = parseInt(doc1.cvalue);

//   ba.mname = doc1.debit;
//   ba.dname = doc1.credit;
//   ba.maccNo = doc1.daccNo;
//   ba.daccNo = doc1.caccNo;
//   ba.mvalue = doc1.dvalue;
//   ba.dvalue = doc1.cvalue;
//   var assetinsert,
//     assetupdate,
//     liabilityinsert,
//     liabilityupdate,
//     assetdecrement;
//   //IncomeStatement Insert into Revenue or Expenses and to the Assets or liability accounts
//   if (
//     [101, 112].includes(doc1.daccNo) &&
//     [
//       400,
//       410,
//       420,
//       430,
//       570,
//       585,
//       595,
//       597,
//       599,
//       631,
//       711,
//       722,
//       726,
//       729,
//       732,
//       905,
//     ].includes(doc1.caccNo)
//   ) {
//     //Expenses decrease in credit
//     var dm = new dmodel(ma);
//     var cm = new cmodel(da);

//     var lm = new lemodel(ba);

//     cm.save(function (err) {
//       if (err) console(err);
//       // saved!
//     });
//     dm.save(function (err) {
//       if (err) console(err);
//       // saved!
//     });
//     lm.save(function (err) {
//       if (err) console(err);
//       // saved!
//     });
//     if (da.accNo > 500) {
//       expmodel.findOne({ accNo: da.accNo }, function (err, dacc) {
//         if (dacc != null) {
//           if (dacc.length > 0) {
//             expmodel.updateOne(
//               { accNo: { $in: [da.accNo] } },
//               { $inc: { value: -da.value } },
//               function (err, res) {
//                 if (err) {
//                   console.log(err);
//                   res.status(500).json({
//                     error: "Technical error occurred",
//                   });
//                 } else {
//                   res.send(body);
//                   res.status(201).json({
//                     message: "Post saved!",
//                   });
//                   console.log("Decrement of Expenses Account: ", da.name);
//                   res.status(400).json({ message: "Expenses Updated" });
//                   res.status(201).json({
//                     message: "Subscription saved.",
//                   });
//                 }
//               }
//             );
//             asmodel.findOne({ accNo: ma.accNo }, function (err, macc) {
//               if (macc) {
//                 asmodel.updateOne(
//                   { accNo: { $in: [ma.accNo] } },
//                   { $inc: { value: ma.value } },
//                   function (err, docs) {
//                     //update Assets
//                     if (err) {
//                       res.status(500).json({
//                         error: "Technical error occurred",
//                       });
//                       res.send(err);
//                     } else {
//                       res.status(201).send(`Updated of Assets`);
//                       console.log("Updated Docs of debit : ", docs);
//                       res.setHeader("Content-Type", "application/json");
//                       res.status(200).json({ docs: "Assets has been Updated" });
//                     }
//                   }
//                 );
//               } else if (macc.length == 0) {
//                 var as = new asmodel(ma);
//                 assetinsert = as.save(function (err, res) {
//                   if (err) console(err);
//                   else res.status(200).send("Assets has been Updated");
//                   // saved!
//                 });
//               } else if (err) {
//                 console.log(err);
//               }
//             });
//           }
//         }
//       });
//     } else if (da.accNo < 500) {
//       revmodel.findOne({ accNo: da.accNo }, function (err, dacc) {
//         if (dacc != null) {
//           if (dacc.length > 0) {
//             expmodel.updateOne(
//               { accNo: { $in: [da.accNo] } },
//               { $inc: { value: da.value } },
//               function (err, res) {
//                 if (err) {
//                   console.log(err);
//                   res.status(500).json({
//                     error: "Technical error occurred",
//                   });
//                 } else {
//                   console.log("Increment of Revenue Account: ", da.name);
//                   res.status(400).send("Revenue Updated");
//                   res.json({
//                     data: "Subscription saved.",
//                   });
//                 }
//               }
//             );
//             asmodel.findOne({ accNo: ma.accNo }, function (err, macc) {
//               if (macc) {
//                 asmodel.updateOne(
//                   { accNo: { $in: [ma.accNo] } },
//                   { $inc: { value: ma.value } },
//                   function (err, docs) {
//                     //update Assets
//                     if (err) {
//                       res.status(500).json({
//                         error: "Technical error occurred",
//                       });
//                       res.send(err);
//                     } else {
//                       res.status(201).send(`Updated of Assets`);
//                       console.log("Updated Docs of debit : ", docs);
//                       res.setHeader("Content-Type", "application/json");
//                       res.status(200).json({ docs: "Assets has been Updated" });
//                     }
//                   }
//                 );
//               } else if (macc.length == 0) {
//                 var as = new asmodel(ma);
//                 assetinsert = as.save(function (err, res) {
//                   if (err) console(err);
//                   else res.status(200).send("Assets has been Updated");
//                   // saved!
//                 });
//               } else if (err) {
//                 console.log(err);
//               }
//             });
//           }
//         }
//       });
//     }

//     mup = bmodel.findOne({ accNo: ma.accNo }, function (err, bacc) {
//       if (bacc) {
//         bmodel.updateOne(
//           { accNo: ma.accNo },
//           { $inc: { mvalue: ma.value } },
//           function (err, docs) {
//             //Update balancesheet
//             if (err) {
//               console.log(err);
//             } else {
//               res.status(200).send("Updated  balancesheet ");
//             }
//           }
//         );
//       } else if (!bacc) {
//         bal.accNo = ma.accNo;
//         bal.accName = ma.accName;
//         bal.mvalue = ma.value;
//         bal.dvalue = 0;
//         var bb = new bmodel(bal);
//         bb.save(function (err) {
//           if (err) res.status(500).send(err);
//           else console.log("Saved!");
//           // saved!
//         });
//       }
//     });
//     if (da.accNo > 500) {
//       ibmodel.findOne({ accNo: da.accNo }, function (err, dacc) {
//         //exp - rev +
//         ibmodel.updateOne(
//           { accNo: da.accNo },
//           { $inc: { dvalue: da.value } },
//           function (err, docs) {
//             if (err) {
//               res.status(500).send(err);
//             } else {
//               // res.status(200).send("Updated in Incomesheet")
//               console.log("Updated Docs of balanceshheet credit : ", docs);
//             }
//           }
//         );
//       });
//     } else {
//       ibmodel.findOne({ accNo: da.accNo }, function (err, dacc) {
//         //exp - rev +
//         ibmodel.updateOne(
//           { accNo: da.accNo },
//           { $inc: { dvalue: -da.value } },
//           function (err, docs) {
//             if (err) {
//               res.status(500).send(err);
//             } else {
//               // res.status(200).send("Updated in Incomesheet")
//               console.log("Updated Docs of balanceshheet credit : ", docs);
//             }
//           }
//         );
//       });
//     }
//     dup = bmodel.findOne({ accNo: da.accNo }, function (err, dacc) {
//       if (dacc && dacc.mvalue >= da.value + dacc.dvalue) {
//         bmodel.updateOne(
//           { accNo: da.accNo },
//           { $inc: { dvalue: da.value } },
//           function (err, docs) {
//             //Update balancesheeet
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("Updated Docs of balanceshheet credit : ", docs);
//             }
//           }
//         );
//       } else if (!dacc) {
//         console.log("Transaction can't be Completed!");

//         // saved!
//       } else if (dacc.mvalue + ma.value < da.value + dacc.dvalue) {
//         bmodel.updateOne(
//           { accNo: ma.accNo },
//           { $inc: { dvalue: ma.value } },
//           function (err, docs) {
//             //Update balancesheet
//             if (err) {
//               console.log(err);
//             } else {
//               console.log(
//                 "Can't be added the Credit is more than the Debit in the Database Rolled back Changes!: ",
//                 docs,
//                 ma.accNo
//               );
//               res.status(404).send("Can't");
//             }
//           }
//         );
//       }
//     });
//   }

//   //Asset inseert ands updates are correct credit and debit and ledger Okay Balancesheet find and update not found insert (for each)

//   if (
//     [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.daccNo) &&
//     [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.caccNo)
//   ) {
//     var dm = new dmodel(ma);
//     var cm = new cmodel(da);

//     var lm = new lemodel(ba);

//     cm.save(function (err) {
//       if (err) console(err);
//       // saved!
//     });
//     dm.save(function (err) {
//       if (err) console(err);
//       // saved!
//     });
//     lm.save(function (err) {
//       if (err) console(err);
//       // saved!
//     });

//     creditAssetupdate = await asmodel
//       .findOne({ accNo: da.accNo }, function (err, dacc) {
//         if (dacc != null) {
//           if (dacc.length > 0) {
//             asmodel
//               .updateOne(
//                 { accNo: { $in: [da.accNo] } },
//                 { $inc: { value: -da.value } },
//                 function (err, res) {
//                   //Update Assets
//                   if (err) {
//                     res.status(500).json({
//                       error: "Technical error occurred",
//                     });
//                   } else {
//                     message +=
//                       "Assets of " +
//                       da.name.toString() +
//                       " has been Updated \n";
//                   }
//                 }
//               )
//               .then(
//                 (message +=
//                   da.name.toString() + " Has been updated in Assets \n")
//               );
//           }
//         }
//       })
//       .then(
//         (message +=
//           "Credit Account " + da.name.toString() + " is Decremented ! \n")
//       );
//     DebitAssetupdate = await asmodel.findOne(
//       { accNo: ma.accNo },
//       function (err, macc) {
//         if (macc) {
//           asmodel
//             .updateOne(
//               { accNo: { $in: [ma.accNo] } },
//               { $inc: { value: ma.value } },
//               function (err, docs) {
//                 //update Assets
//                 if (err) {
//                   res.status(500).json({
//                     error: "Technical error occurred",
//                   });
//                   res.send(err);
//                 }
//               }
//             )
//             .then(
//               (message += "Debit Asset " + ma.name.toString() + " is updated\n")
//             );
//         } else if (macc == null) {
//           message += "Debit Asset" + ma.name + " is Created\n";
//           var as = new asmodel(ma);
//           assetinsert = as.save(function (err, res) {
//             if (err) console(err);
//           });
//         } else if (err) {
//           res.status(500).json({
//             error: "Technical error occurred",
//           });
//         }
//       }
//     );

//     mup = await bmodel
//       .findOne({ accNo: ma.accNo }, function (err, bacc) {
//         if (bacc) {
//           bmodel.updateOne(
//             { accNo: ma.accNo },
//             { $inc: { mvalue: ma.value } },
//             function (err, docs) {
//               //Update balancesheet
//               if (err) {
//                 res.status(500).json({
//                   error: "Technical error occurred",
//                 });
//               } else {
//                 // res.status(201).send('Ipdated Debits',ma.name.toString());
//                 //  assetupdate.then(  message+=(' '+ma.name.toString()+' was updated in Balancesheet \n'))
//               }
//             }
//           );
//         } else if (!bacc) {
//           bal.accNo = ma.accNo;
//           bal.accName = ma.accName;
//           bal.mvalue = ma.value;
//           bal.dvalue = 0;
//           var bb = new bmodel(bal);
//           bb.save(function (err) {
//             if (err) console(err);
//           });
//         }
//       })
//       .then(
//         (message += " " + ma.name + " has been updated in the BalanceSheet \n")
//       );

//     bmodel
//       .findOne({ accNo: da.accNo }, function (err, dacc) {
//         if (dacc && dacc.mvalue >= da.value + dacc.dvalue) {
//           bmodel.updateOne(
//             { accNo: da.accNo },
//             { $inc: { dvalue: da.value } },
//             function (err, docs) {
//               //Update balancesheeet
//               if (err) {
//                 console.log(err);
//               } else {
//               }
//             }
//           );
//         } else if (!dacc) {
//           message += "Transaction can't be Completed! \n";

//           // saved!
//         } else if (dacc.mvalue + ma.value < da.value + dacc.dvalue) {
//           bmodel.updateOne(
//             { accNo: ma.accNo },
//             { $inc: { dvalue: ma.value } },
//             function (err, docs) {
//               //Update balancesheet
//               if (err) {
//                 console.log(err);
//               } else {
//                 message +=
//                   "Credit of" +
//                   da.name +
//                   " is more than the Debit in the Database Rolled back Changes!";
//               }
//             }
//           );
//         }
//       })
//       .then(
//         (message += " " + da.name + " has been updated in the BalanceSheet \n")
//       );

//     res.status(200).json({
//       message: message,
//     });
//     console.log(message);
//     message = "";
//     console.log(ma);
//     ma, da, ba, (bal = {});
//   }

//   // Asset is a debit and liability or Shareholder is the credit
//   else if (
//     [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.daccNo) &&
//     [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
//       doc1.caccNo
//     )
//   ) {
//     var dm = new dmodel(ma); //Creation of debit Account
//     var cm = new cmodel(da); // Creation of credit Account
//     var lm = new lemodel(ba); //Creation of a ledger

//     cm.save(function (err) {
//       //Saving credit table
//       if (err) console(err);
//       // saved!
//     });
//     dm.save(function (err) {
//       //Saving debit table
//       if (err) console(err);
//       // saved!
//     });
//     lm.save(function (err) {
//       //Saving ledger table
//       if (err) console(err);
//       // saved!
//     });
//     console.log(ma.value);
//     asmodel
//       .updateOne(
//         { accNo: { $in: [ma.accNo] } },
//         { $inc: { value: ma.value } },
//         function (err, docs) {
//           //update Assets
//           if (err) {
//             console.log(err);
//           } else if (docs.nModified == 0) {
//             var as = new asmodel(ma);
//             as.save(function (err) {
//               if (err) console.log(err);
//               else
//                 message +=
//                   " " + ma.name + " has been Created in the Assets table! \n";
//               // saved!
//             });
//           } else {
//             console.log("Updated Docs of debit account in Assets: ", ma.name);
//           }
//         }
//       )
//       .then((message += " " + ma.name + " has been updated in the Assets \n"));

//     if ([200, 201, 209, 230, 231].includes(doc1.caccNo)) {
//       //find acc in liabilities if found increment else add

//       limodel
//         .findOne({ accNo: da.accNo }, function (err, acc) {
//           if (err) {
//             console.log(err);
//           } else if (acc != null) {
//             limodel.updateOne(
//               { accNo: { $in: [da.accNo] } },
//               { $inc: { value: da.value } },
//               function (err, docs) {
//                 //update Assets
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   console.log(
//                     "Updated Docs of Credit Liabililty : ",
//                     da.name,
//                     docs
//                   );
//                 }
//               }
//             );
//           } else if (!acc) {
//             var li = new limodel(da);
//             liabilityinsert = li.save(function (err) {
//               if (err) console.log(err);
//               else
//                 message +=
//                   " " + da.name + " has been Created in the Liabilities \n";
//               // saved!
//             });
//           }
//         })
//         .then(
//           (message += " " + da.name + " has been Updated in the Liabilities \n")
//         );

//       //find acc in shareholder if found increment else add
//     } else if ([300, 311, 320, 330, 332, 350, 360].includes(doc1.caccNo)) {
//       shmodel
//         .updateOne(
//           { accNo: { $in: [da.accNo] } },
//           { $inc: { value: da.value } },
//           function (err, docs) {
//             //update Assets
//             if (err) {
//               console.log(err);
//             } else if (docs.nModified == 0) {
//               var sh = new shmodel(da);
//               sh.save(function (err) {
//                 if (err) console.log(err);
//                 else
//                   console.log(
//                     " " + da.name + " has been Created in the Shareholders \n"
//                   );
//                 // saved!
//               });
//             } else if (docs) {
//               console.log("Updated Docs of Credit Shareholder : ", da.name);
//             }
//           }
//         )
//         .then((message += " " + da.name + " has been updated in shareholders"));
//     }
//     //Now find the account in balancesheet and increment or decrement or add
//     mup = bmodel.findOne({ accNo: ma.accNo }, function (err, bacc) {
//       if (bacc) {
//         bmodel.updateOne(
//           { accNo: ma.accNo },
//           { $inc: { mvalue: ma.value } },
//           function (err, docs) {
//             //Update balancesheet
//             if (err) {
//               console.log(err);
//             } else {
//               message +=
//                 " " + ma.name + " has been updated in the Balancesheet \n";
//               console.log(
//                 "Updated Docs of debit balancesheet : ",
//                 ma.accNo,
//                 da.accNo,
//                 docs
//               );
//             }
//           }
//         );
//       } else if (!bacc) {
//         bal.accNo = ma.accNo;
//         bal.accName = ma.accName;
//         bal.mvalue = ma.value;
//         bal.dvalue = 0;
//         var bb = new bmodel(bal);
//         bb.save(function (err) {
//           if (err) console(err);
//           else
//             message +=
//               " " + ma.name + " has been Created in the Balancesheet \n";
//           // saved!
//         });
//       }
//     });

//     dup = bmodel.findOne({ accNo: da.accNo }, function (err, dacc) {
//       if (err) {
//         console.log(err);
//       }
//       if (dacc) {
//         bmodel.updateOne(
//           { accNo: da.accNo },
//           { $inc: { dvalue: da.value } },
//           function (err, docs) {
//             //Update balancesheeet
//             if (err) {
//               console.log(err);
//             } else {
//               message +=
//                 " " + da.name + " has been updated in the Balancesheet \n";
//               console.log("Updated Docs of balanceshheet credit : ", da.name);
//             }
//           }
//         );
//       } else if (!dacc) {
//         bal.accNo = da.accNo;
//         bal.accName = da.accName;
//         bal.mvalue = 0;
//         bal.dvalue = da.value;
//         var bb = new bmodel(bal);
//         bb.save(function (err) {
//           if (err) console(err);
//           else
//             message += " " + da.name + " has been Saved in the Balancesheet \n";
//           // saved!
//         });
//       }
//     });

//     console.log(message);
//     if (message.length > 0) {
//       res.status(200).json({
//         message: message,
//       });
//     }

//     message = "";
//     ma, da, ba, (bal = {});
//   }
//   if (
//     [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
//       doc1.daccNo
//     ) &&
//     [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.caccNo)
//   ) {
//     var dm = new dmodel(ma); //Creation of debit Account
//     var cm = new cmodel(da); // Creation of credit Account
//     var lm = new lemodel(ba); //Creation of a ledger
//     await bmodel
//       .find(
//         { accNo: { $in: [da.accNo, ma.accNo] } },
//         async function (err, acc) {
//           if (err) {
//             console.log(err);
//           }
//           if (acc.length > 0) {
//             await asmodel
//               .findOneAndUpdate(
//                 { accNo: { $in: [da.accNo] } },
//                 { $inc: { value: -da.value } }
//               )
//               .exec(); //checked!

//             if ([200, 201, 209, 230, 231].includes(doc1.daccNo)) {
//               await limodel
//                 .findOneAndUpdate(
//                   { accNo: { $in: [ma.accNo] } },
//                   { $inc: { value: -ma.value } }
//                 )
//                 .exec(); //checked

//               //find acc in shareholder if found increment else add
//             } else if (
//               [300, 311, 320, 330, 332, 350, 360].includes(doc1.daccNo)
//             ) {
//               console.log(doc1.daccNo);
//               await shmodel
//                 .findOneAndUpdate(
//                   { accNo: { $in: [ma.accNo] } },
//                   { $inc: { value: -ma.value } }
//                 )
//                 .exec(); //checked
//             }

//             const liabilityAccount = acc.filter(
//               (acc) => acc.accNo == (200 || 201 || 209 || 230 || 231)
//             );
//             const assetAccount = acc.filter(
//               (acc) => acc.accNo == (101 || 108 || 110 || 112 || 157 || 130)
//             );

//             //console.log(liabilityAccount[0].accNo)

//             await bmodel
//               .findOneAndUpdate(
//                 {
//                   $and: [
//                     { accNo: assetAccount[0].accNo },
//                     {
//                       mvalue: {
//                         $gte: parseInt(da.value) + assetAccount[0].dvalue,
//                       },
//                     },
//                   ],
//                 },
//                 { $inc: { dvalue: da.value } }
//               )
//               .exec()
//               .then(
//                 (message +=
//                   " " + ma.name + " has been updated in the Balancesheet \n")
//               );

//             await bmodel
//               .findOneAndUpdate(
//                 {
//                   $and: [
//                     { accNo: liabilityAccount[0].accNo },
//                     {
//                       dvalue: {
//                         $gte: parseInt(ma.value) + liabilityAccount[0].mvalue,
//                       },
//                     },
//                   ],
//                 },
//                 { $inc: { mvalue: ma.value } }
//               )
//               .exec()
//               .then(
//                 (message +=
//                   " " + da.name + " has been updated in the Balancesheet \n")
//               );

//             cm.save(function (err) {
//               //Saving credit table
//               if (err) console(err);
//               // saved!
//             });
//             dm.save(function (err) {
//               //Saving debit table
//               if (err) console(err);
//               // saved!
//             });
//             lm.save(function (err) {
//               //Saving ledger table
//               if (err) console(err);
//               // saved!
//             });
//           } else if (!acc) {
//             message += " " + ma.name + " doesn't exist in balancesheet \n";
//           }
//         }
//       )
//       .then(
//         (message +=
//           " " +
//           ma.name +
//           " And " +
//           da.name +
//           " has been Updated in balancesheet \n")
//       );

//     console.log(message);
//     if (message.length > 0) {
//       res.status(200).json({
//         message: message,
//       });
//     }

//     message = "";
//     ma, da, ba, (bal = {});
//   } else if (
//     [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
//       doc1.daccNo
//     ) &&
//     [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
//       doc1.caccNo
//     )
//   ) {
//     var bool = true;

//     var dm = new dmodel(ma); //Creation of debit Account
//     var cm = new cmodel(da); // Creation of credit Account
//     var lm = new lemodel(ba); //Creation of a ledger
//     const as = await bmodel
//       .find({ accNo: { $in: [ma.accNo] } }, async function (err, acc) {
//         //you must check the value > 0
//         if (err) {
//           console.log(err);
//         }
//         if (acc.length > 0 && ma.value + acc[0].mvalue <= acc[0].dvalue) {
//           if ([200, 201, 209, 230, 231].includes(doc1.caccNo)) {
//             await limodel
//               .findOneAndUpdate(
//                 { accNo: { $in: [da.accNo] } },
//                 { $inc: { value: da.value } },
//                 {
//                   new: true,
//                   upsert: true,
//                 }
//               )
//               .exec(); //checked

//             //else create

//             //find acc in shareholder if found increment else add
//           } else if (
//             [300, 311, 320, 330, 332, 350, 360].includes(doc1.caccNo)
//           ) {
//             await shmodel
//               .findOneAndUpdate(
//                 { accNo: { $in: [da.accNo] } },
//                 { $inc: { value: da.value } },
//                 {
//                   new: true,
//                   upsert: true,
//                 }
//               )
//               .exec(); //checked

//             // update else create
//           }

//           if ([200, 201, 209, 230, 231].includes(doc1.daccNo)) {
//             console.log(doc1.caccNo);
//             await limodel
//               .findOneAndUpdate(
//                 { accNo: { $in: [ma.accNo] } },
//                 { $inc: { value: -ma.value } }
//               )
//               .exec(); //checked

//             //find acc in shareholder if found increment else add
//           } else if (
//             [300, 311, 320, 330, 332, 350, 360].includes(doc1.daccNo)
//           ) {
//             await shmodel
//               .findOneAndUpdate(
//                 { accNo: { $in: [ma.accNo] } },
//                 { $inc: { value: -ma.value } }
//               )
//               .exec(); //checked
//           }

//           await bmodel
//             .findOneAndUpdate(
//               { $and: [{ accNo: ma.accNo }] },
//               { $inc: { mvalue: ma.value } }
//             )
//             .exec()
//             .then(
//               (message +=
//                 " " + ma.name + " has been updated in the Balancesheet \n")
//             );

//           await bmodel
//             .findOneAndUpdate(
//               { $and: [{ accNo: da.accNo }] },
//               { $inc: { dvalue: da.value, mvalue: 0 } },
//               {
//                 new: true,
//                 upsert: true,
//               }
//             )
//             .exec()
//             .then(
//               (message +=
//                 " " + da.name + " has been updated in the Balancesheet \n")
//             );
//           //else create

//           cm.save(function (err) {
//             //Saving credit table
//             if (err) console(err);
//             // saved!
//           });
//           dm.save(function (err) {
//             //Saving debit table
//             if (err) console(err);
//             // saved!
//           });
//           lm.save(function (err) {
//             //Saving ledger table
//             if (err) console(err);
//             // saved!
//           });

//           // }else if(!acc)
//           // {
//           //  message+=" "+ma.name+" doesn't exist in balancesheet \n"
//           // }
//           // else if (ma.value+acc[0].mvalue>acc[0].dvalue){

//           //  bool = false
//           //   console.log(bool)

//           //   console.log("Account value doesn't allow",acc[0].mvalue+ma.value+">"+acc[0].dvalue)
//         } else {
//           message +=
//             "Attention: Account Doesn't exist Or " +
//             ma.name +
//             " value must be less than Or Equal " +
//             (parseInt(acc[0].dvalue) - parseInt(acc[0].mvalue));
//         }
//       })
//       .then(
//         (message +=
//           " " +
//           ma.name +
//           " And " +
//           da.name +
//           bool +
//           " has been Updated in balancesheet \n"),
//         bool == false
//           ? (message +=
//               "Attention! Failed: Account value doesn't allow " +
//               acc[0].mvalue +
//               "+" +
//               ma.value +
//               ">" +
//               acc[0].dvalue +
//               "\n")
//           : ""
//       );

//     if (message.length > 0) {
//       res.status(200).json({
//         message: message,
//       });
//     }

//     message = "";
//     ma, da, ba, (bal = {});
//   }
// });

// app.post("/activateBalance", function (req, res) {
//   var doc1 = { name: req.body.credit, value: req.body.cvalue };

//   console.log("doc:", doc1);

//   const re = {};
//   re.name = doc1.name;
//   re.value = doc1.value;
//   re.save(function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Balance", result);
//     }
//   });
// });

// app.get("/getTrailBalance", async function (req, res) {
//   lemodel.find({}, (err, book) => {
//     if (err) {
//       res.send(err);
//     } else if (book.length == 0) {
//       var responseObject = undefined;
//       res.status(404).send("There is No Data yet!");
//     } else if (book.length > 0) {
//       res.send(book);
//     }
//   });
// });

// app.get("/getBalance", async function (req, res) {
//   a = [];

//   const t = await bmodel.aggregate(
//     [
//       {
//         $project: {
//           _id: "$accNo",
//           mvalue: "$mvalue",
//           cvalue: "$dvalue",
//         },
//       },
//       {
//         $addFields: {
//           Result: {
//             $subtract:
//               "$dvalue" > "$mvalue"
//                 ? ["$dvalue", "$mvalue"]
//                 : ["$mvalue", "$dvalue"],
//           },
//         },
//       },
//     ],
//     (err, creditbook) => {
//       if (err) {
//         res.status(500).send(err);
//       } else if (creditbook.length == 0) {
//         res.status(404).send("There is No Data yet!");
//       } else {
//         a.push(creditbook);
//       }
//     }
//   );
//   res.send(t);
// });

// app.use(function (err, req, res, next) {
//   console.error(err.message);
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).send(err.message);

//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000/");
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");

//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://zaccounting.netlify.app/"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "http://zaccounting.netlify.app/"
//   );
//   //res.setHeader('Access-Control-Allow-Origin', '*'); // to enable calls from every domain
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });
