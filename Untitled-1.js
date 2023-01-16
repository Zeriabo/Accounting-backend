app.post("/savedata", async function (req, res) {
  var doc1 = {
    credit: req.body.credit,
    debit: req.body.debit,
    caccNo: req.body.cAccNo,
    daccNo: req.body.dAccNo,
    dvalue: req.body.dvalue,
    cvalue: req.body.cvalue,
  };

  //Need to insert to the leger for the Trail balance sheet!!!!!
  const DD = "Debit";
  CC = "Credit";
  var debit = {};
  var credit = {};
  var balance = {};
  var bal = {};

  debit.name = doc1.debit;
  debit.accNo = doc1.daccNo;
  debit.value = parseInt(doc1.dvalue);
  credit.name = doc1.credit;
  credit.accNo = doc1.caccNo;
  credit.value = parseInt(doc1.cvalue);

  balance.mname = doc1.debit;
  balance.dname = doc1.credit;
  balance.maccNo = doc1.daccNo;
  balance.daccNo = doc1.caccNo;
  balance.mvalue = doc1.dvalue;
  balance.dvalue = doc1.cvalue;

  //IncomeStatement Insert into Revenue or Expenses and to the Assets or liability accounts
  if (
    [101, 112].includes(doc1.daccNo) &&
    [
      400,
      410,
      420,
      430,
      570,
      585,
      595,
      597,
      599,
      631,
      711,
      722,
      726,
      729,
      732,
      905,
    ].includes(doc1.caccNo)
  ) {
    //Expenses decrease in credit
    var debitModel = new dmodel(debit);
    var creditModel = new cmodel(credit);

    var ledgerModel = new lemodel(balance);
    //service to register a ledger
    registerLedger(debitModel, creditModel, ledgerModel);

    if (credit.accNo > 500) {
      expmodel.findOne({ accNo: credit.accNo }, function (err, dacc) {
        if (dacc != null) {
          if (dacc.length > 0) {
            expmodel.updateOne(
              { accNo: { $in: [credit.accNo] } },
              { $inc: { value: -credit.value } },
              function (err, res) {
                if (err) {
                  res.status(500).json({
                    error: err,
                  });
                } else {
                  res.send(body);
                  res.status(201).json({
                    message: "Post saved!",
                  });
                  console.log("Decrement of Expenses Account: ", credit.name);
                  res.status(400).json({ message: "Expenses Updated" });
                  res.status(201).json({
                    message: "Subscription saved.",
                  });
                }
              }
            );
            asmodel.findOne({ accNo: debit.accNo }, function (err, macc) {
              if (macc) {
                asmodel.updateOne(
                  { accNo: { $in: [debit.accNo] } },
                  { $inc: { value: debit.value } },
                  function (err, docs) {
                    //update Assets
                    if (err) {
                      res.status(500).json({
                        error: "Technical error occurred",
                      });
                      res.send(err);
                    } else {
                      res.status(201).send(`Updated of Assets`);
                      console.log("Updated Docs of debit : ", docs);
                      res.setHeader("Content-Type", "application/json");
                      res.status(200).json({ docs: "Assets has been Updated" });
                    }
                  }
                );
              } else if (macc.length == 0) {
                var as = new asmodel(debit);
                assetinsert = as.save(function (err, res) {
                  if (err) console(err);
                  else res.status(200).send("Assets has been Updated");
                  // saved!
                });
              } else if (err) {
                console.log(err);
              }
            });
          }
        }
      });
    } else if (credit.accNo < 500) {
      revmodel.findOne({ accNo: credit.accNo }, function (err, dacc) {
        if (dacc != null) {
          if (dacc.length > 0) {
            expmodel.updateOne(
              { accNo: { $in: [credit.accNo] } },
              { $inc: { value: credit.value } },
              function (err, res) {
                if (err) {
                  console.log(err);
                  res.status(500).json({
                    error: "Technical error occurred",
                  });
                } else {
                  console.log("Increment of Revenue Account: ", credit.name);
                  res.status(400).send("Revenue Updated");
                  res.json({
                    data: "Subscription saved.",
                  });
                }
              }
            );
            asmodel.findOne({ accNo: debit.accNo }, function (err, macc) {
              if (macc) {
                asmodel.updateOne(
                  { accNo: { $in: [debit.accNo] } },
                  { $inc: { value: debit.value } },
                  function (err, docs) {
                    //update Assets
                    if (err) {
                      res.status(500).json({
                        error: "Technical error occurred",
                      });
                      res.send(err);
                    } else {
                      res.status(201).send(`Updated of Assets`);
                      console.log("Updated Docs of debit : ", docs);
                      res.setHeader("Content-Type", "application/json");
                      res.status(200).json({ docs: "Assets has been Updated" });
                    }
                  }
                );
              } else if (macc.length == 0) {
                var as = new asmodel(debit);
                assetinsert = as.save(function (err, res) {
                  if (err) console(err);
                  else res.status(200).send("Assets has been Updated");
                  // saved!
                });
              } else if (err) {
                console.log(err);
              }
            });
          }
        }
      });
    }

    mup = bmodel.findOne({ accNo: debit.accNo }, function (err, bacc) {
      if (bacc) {
        bmodel.updateOne(
          { accNo: debit.accNo },
          { $inc: { mvalue: debit.value } },
          function (err, docs) {
            //Update balancesheet
            if (err) {
              console.log(err);
            } else {
              res.status(200).send("Updated  balancesheet ");
            }
          }
        );
      } else if (!bacc) {
        bal.accNo = debit.accNo;
        bal.accName = debit.accName;
        bal.mvalue = debit.value;
        bal.dvalue = 0;
        var bb = new bmodel(bal);
        bb.save(function (err) {
          if (err) res.status(500).send(err);
          else console.log("Saved!");
          // saved!
        });
      }
    });
    if (credit.accNo > 500) {
      ibmodel.findOne({ accNo: credit.accNo }, function (err, dacc) {
        //exp - rev +
        ibmodel.updateOne(
          { accNo: credit.accNo },
          { $inc: { dvalue: credit.value } },
          function (err, docs) {
            if (err) {
              res.status(500).send(err);
            } else {
              // res.status(200).send("Updated in Incomesheet")
              console.log("Updated Docs of balanceshheet credit : ", docs);
            }
          }
        );
      });
    } else {
      ibmodel.findOne({ accNo: credit.accNo }, function (err, dacc) {
        //exp - rev +
        ibmodel.updateOne(
          { accNo: credit.accNo },
          { $inc: { dvalue: -credit.value } },
          function (err, docs) {
            if (err) {
              res.status(500).send(err);
            } else {
              // res.status(200).send("Updated in Incomesheet")
              console.log("Updated Docs of balanceshheet credit : ", docs);
            }
          }
        );
      });
    }
    dup = bmodel.findOne({ accNo: credit.accNo }, function (err, dacc) {
      if (dacc && dacc.mvalue >= credit.value + dacc.dvalue) {
        bmodel.updateOne(
          { accNo: credit.accNo },
          { $inc: { dvalue: credit.value } },
          function (err, docs) {
            //Update balancesheeet
            if (err) {
              console.log(err);
            } else {
              console.log("Updated Docs of balanceshheet credit : ", docs);
            }
          }
        );
      } else if (!dacc) {
        console.log("Transaction can't be Completed!");

        // saved!
      } else if (dacc.mvalue + debit.value < credit.value + dacc.dvalue) {
        bmodel.updateOne(
          { accNo: debit.accNo },
          { $inc: { dvalue: debit.value } },
          function (err, docs) {
            //Update balancesheet
            if (err) {
              console.log(err);
            } else {
              console.log(
                "Can't be added the Credit is more than the Debit in the Database Rolled back Changes!: ",
                docs,
                debit.accNo
              );
              res.status(404).send("Can't");
            }
          }
        );
      }
    });
  }

  //Asset inseert ands updates are correct credit and debit and ledger Okay Balancesheet find and update not found insert (for each)

  if (
    [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.daccNo) &&
    [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.caccNo)
  ) {
    var debitModel = new dmodel(debit);
    var creditModel = new cmodel(credit);

    var ledgerModel = new lemodel(balance);

    creditModel.save(function (err) {
      if (err) console(err);
      // saved!
    });
    debitModel.save(function (err) {
      if (err) console(err);
      // saved!
    });
    ledgerModel.save(function (err) {
      if (err) console(err);
      // saved!
    });

    creditAssetupdate = await asmodel
      .findOne({ accNo: credit.accNo }, function (err, dacc) {
        if (dacc != null) {
          if (dacc.length > 0) {
            asmodel
              .updateOne(
                { accNo: { $in: [credit.accNo] } },
                { $inc: { value: -credit.value } },
                function (err, res) {
                  //Update Assets
                  if (err) {
                    res.status(500).json({
                      error: "Technical error occurred",
                    });
                  } else {
                    message +=
                      "Assets of " +
                      credit.name.toString() +
                      " has been Updated \n";
                  }
                }
              )
              .then(
                (message +=
                  credit.name.toString() + " Has been updated in Assets \n")
              );
          }
        }
      })
      .then(
        (message +=
          "Credit Account " + credit.name.toString() + " is Decremented ! \n")
      );
    DebitAssetupdate = await asmodel.findOne(
      { accNo: debit.accNo },
      function (err, macc) {
        if (macc) {
          asmodel
            .updateOne(
              { accNo: { $in: [debit.accNo] } },
              { $inc: { value: debit.value } },
              function (err, docs) {
                //update Assets
                if (err) {
                  res.status(500).json({
                    error: "Technical error occurred",
                  });
                  res.send(err);
                }
              }
            )
            .then(
              (message +=
                "Debit Asset " + debit.name.toString() + " is updated\n")
            );
        } else if (macc == null) {
          message += "Debit Asset" + debit.name + " is Created\n";
          var as = new asmodel(debit);
          assetinsert = as.save(function (err, res) {
            if (err) console(err);
          });
        } else if (err) {
          res.status(500).json({
            error: "Technical error occurred",
          });
        }
      }
    );

    mup = await bmodel
      .findOne({ accNo: debit.accNo }, function (err, bacc) {
        if (bacc) {
          bmodel.updateOne(
            { accNo: debit.accNo },
            { $inc: { mvalue: debit.value } },
            function (err, docs) {
              //Update balancesheet
              if (err) {
                res.status(500).json({
                  error: "Technical error occurred",
                });
              } else {
                // res.status(201).send('Ipdated Debits',ma.name.toString());
                //  assetupdate.then(  message+=(' '+ma.name.toString()+' was updated in Balancesheet \n'))
              }
            }
          );
        } else if (!bacc) {
          bal.accNo = debit.accNo;
          bal.accName = debit.accName;
          bal.mvalue = debit.value;
          bal.dvalue = 0;
          var bb = new bmodel(bal);
          bb.save(function (err) {
            if (err) console(err);
          });
        }
      })
      .then(
        (message +=
          " " + debit.name + " has been updated in the BalanceSheet \n")
      );

    bmodel
      .findOne({ accNo: credit.accNo }, function (err, dacc) {
        if (dacc && dacc.mvalue >= credit.value + dacc.dvalue) {
          bmodel.updateOne(
            { accNo: credit.accNo },
            { $inc: { dvalue: credit.value } },
            function (err, docs) {
              //Update balancesheeet
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        } else if (!dacc) {
          message += "Transaction can't be Completed! \n";

          // saved!
        } else if (dacc.mvalue + debit.value < credit.value + dacc.dvalue) {
          bmodel.updateOne(
            { accNo: debit.accNo },
            { $inc: { dvalue: debit.value } },
            function (err, docs) {
              //Update balancesheet
              if (err) {
                console.log(err);
              } else {
                message +=
                  "Credit of" +
                  credit.name +
                  " is more than the Debit in the Database Rolled back Changes!";
              }
            }
          );
        }
      })
      .then(
        (message +=
          " " + credit.name + " has been updated in the BalanceSheet \n")
      );

    res.status(200).json({
      message: message,
    });
    console.log(message);
    message = "";
    console.log(debit);
    debit, credit, balance, (bal = {});
  }

  // Asset is a debit and liability or Shareholder is the credit
  else if (
    [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.daccNo) &&
    [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
      doc1.caccNo
    )
  ) {
    var debitModel = new dmodel(debit); //Creation of debit Account
    var creditModel = new cmodel(credit); // Creation of credit Account
    var ledgerModel = new lemodel(balance); //Creation of a ledger

    creditModel.save(function (err) {
      //Saving credit table
      if (err) console(err);
      // saved!
    });
    debitModel.save(function (err) {
      //Saving debit table
      if (err) console(err);
      // saved!
    });
    ledgerModel.save(function (err) {
      //Saving ledger table
      if (err) console(err);
      // saved!
    });
    console.log(debit.value);
    asmodel
      .updateOne(
        { accNo: { $in: [debit.accNo] } },
        { $inc: { value: debit.value } },
        function (err, docs) {
          //update Assets
          if (err) {
            console.log(err);
          } else if (docs.nModified == 0) {
            var as = new asmodel(debit);
            as.save(function (err) {
              if (err) console.log(err);
              else
                message +=
                  " " +
                  debit.name +
                  " has been Created in the Assets table! \n";
              // saved!
            });
          } else {
            console.log(
              "Updated Docs of debit account in Assets: ",
              debit.name
            );
          }
        }
      )
      .then(
        (message += " " + debit.name + " has been updated in the Assets \n")
      );

    if ([200, 201, 209, 230, 231].includes(doc1.caccNo)) {
      //find acc in liabilities if found increment else add

      limodel
        .findOne({ accNo: credit.accNo }, function (err, acc) {
          if (err) {
            console.log(err);
          } else if (acc != null) {
            limodel.updateOne(
              { accNo: { $in: [credit.accNo] } },
              { $inc: { value: credit.value } },
              function (err, docs) {
                //update Assets
                if (err) {
                  console.log(err);
                } else {
                  console.log(
                    "Updated Docs of Credit Liabililty : ",
                    credit.name,
                    docs
                  );
                }
              }
            );
          } else if (!acc) {
            var li = new limodel(credit);
            liabilityinsert = li.save(function (err) {
              if (err) console.log(err);
              else
                message +=
                  " " + credit.name + " has been Created in the Liabilities \n";
              // saved!
            });
          }
        })
        .then(
          (message +=
            " " + credit.name + " has been Updated in the Liabilities \n")
        );

      //find acc in shareholder if found increment else add
    } else if ([300, 311, 320, 330, 332, 350, 360].includes(doc1.caccNo)) {
      shmodel
        .updateOne(
          { accNo: { $in: [credit.accNo] } },
          { $inc: { value: credit.value } },
          function (err, docs) {
            //update Assets
            if (err) {
              console.log(err);
            } else if (docs.nModified == 0) {
              var sh = new shmodel(credit);
              sh.save(function (err) {
                if (err) console.log(err);
                else
                  console.log(
                    " " +
                      credit.name +
                      " has been Created in the Shareholders \n"
                  );
                // saved!
              });
            } else if (docs) {
              console.log("Updated Docs of Credit Shareholder : ", credit.name);
            }
          }
        )
        .then(
          (message += " " + credit.name + " has been updated in shareholders")
        );
    }
    //Now find the account in balancesheet and increment or decrement or add
    mup = bmodel.findOne({ accNo: debit.accNo }, function (err, bacc) {
      if (bacc) {
        bmodel.updateOne(
          { accNo: debit.accNo },
          { $inc: { mvalue: debit.value } },
          function (err, docs) {
            //Update balancesheet
            if (err) {
              console.log(err);
            } else {
              message +=
                " " + debit.name + " has been updated in the Balancesheet \n";
              console.log(
                "Updated Docs of debit balancesheet : ",
                debit.accNo,
                credit.accNo,
                docs
              );
            }
          }
        );
      } else if (!bacc) {
        bal.accNo = debit.accNo;
        bal.accName = debit.accName;
        bal.mvalue = debit.value;
        bal.dvalue = 0;
        var bb = new bmodel(bal);
        bb.save(function (err) {
          if (err) console(err);
          else
            message +=
              " " + debit.name + " has been Created in the Balancesheet \n";
          // saved!
        });
      }
    });

    dup = bmodel.findOne({ accNo: credit.accNo }, function (err, dacc) {
      if (err) {
        console.log(err);
      }
      if (dacc) {
        bmodel.updateOne(
          { accNo: credit.accNo },
          { $inc: { dvalue: credit.value } },
          function (err, docs) {
            //Update balancesheeet
            if (err) {
              console.log(err);
            } else {
              message +=
                " " + credit.name + " has been updated in the Balancesheet \n";
              console.log(
                "Updated Docs of balanceshheet credit : ",
                credit.name
              );
            }
          }
        );
      } else if (!dacc) {
        bal.accNo = credit.accNo;
        bal.accName = credit.accName;
        bal.mvalue = 0;
        bal.dvalue = credit.value;
        var bb = new bmodel(bal);
        bb.save(function (err) {
          if (err) console(err);
          else
            message +=
              " " + credit.name + " has been Saved in the Balancesheet \n";
          // saved!
        });
      }
    });

    console.log(message);
    if (message.length > 0) {
      res.status(200).json({
        message: message,
      });
    }

    message = "";
    debit, credit, balance, (bal = {});
  }
  if (
    [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
      doc1.daccNo
    ) &&
    [101, 102, 108, 110, 112, 116, 130, 157, 158].includes(doc1.caccNo)
  ) {
    var debitModel = new dmodel(debit); //Creation of debit Account
    var creditModel = new cmodel(credit); // Creation of credit Account
    var ledgerModel = new lemodel(balance); //Creation of a ledger
    await bmodel
      .find(
        { accNo: { $in: [credit.accNo, debit.accNo] } },
        async function (err, acc) {
          if (err) {
            console.log(err);
          }
          if (acc.length > 0) {
            await asmodel
              .findOneAndUpdate(
                { accNo: { $in: [credit.accNo] } },
                { $inc: { value: -credit.value } }
              )
              .exec(); //checked!

            if ([200, 201, 209, 230, 231].includes(doc1.daccNo)) {
              await limodel
                .findOneAndUpdate(
                  { accNo: { $in: [debit.accNo] } },
                  { $inc: { value: -debit.value } }
                )
                .exec(); //checked

              //find acc in shareholder if found increment else add
            } else if (
              [300, 311, 320, 330, 332, 350, 360].includes(doc1.daccNo)
            ) {
              console.log(doc1.daccNo);
              await shmodel
                .findOneAndUpdate(
                  { accNo: { $in: [debit.accNo] } },
                  { $inc: { value: -debit.value } }
                )
                .exec(); //checked
            }

            const liabilityAccount = acc.filter(
              (acc) => acc.accNo == (200 || 201 || 209 || 230 || 231)
            );
            const assetAccount = acc.filter(
              (acc) => acc.accNo == (101 || 108 || 110 || 112 || 157 || 130)
            );

            //console.log(liabilityAccount[0].accNo)

            await bmodel
              .findOneAndUpdate(
                {
                  $and: [
                    { accNo: assetAccount[0].accNo },
                    {
                      mvalue: {
                        $gte: parseInt(credit.value) + assetAccount[0].dvalue,
                      },
                    },
                  ],
                },
                { $inc: { dvalue: credit.value } }
              )
              .exec()
              .then(
                (message +=
                  " " + debit.name + " has been updated in the Balancesheet \n")
              );

            await bmodel
              .findOneAndUpdate(
                {
                  $and: [
                    { accNo: liabilityAccount[0].accNo },
                    {
                      dvalue: {
                        $gte:
                          parseInt(debit.value) + liabilityAccount[0].mvalue,
                      },
                    },
                  ],
                },
                { $inc: { mvalue: debit.value } }
              )
              .exec()
              .then(
                (message +=
                  " " +
                  credit.name +
                  " has been updated in the Balancesheet \n")
              );

            creditModel.save(function (err) {
              //Saving credit table
              if (err) console(err);
              // saved!
            });
            debitModel.save(function (err) {
              //Saving debit table
              if (err) console(err);
              // saved!
            });
            ledgerModel.save(function (err) {
              //Saving ledger table
              if (err) console(err);
              // saved!
            });
          } else if (!acc) {
            message += " " + debit.name + " doesn't exist in balancesheet \n";
          }
        }
      )
      .then(
        (message +=
          " " +
          debit.name +
          " And " +
          credit.name +
          " has been Updated in balancesheet \n")
      );

    console.log(message);
    if (message.length > 0) {
      res.status(200).json({
        message: message,
      });
    }

    message = "";
    debit, credit, balance, (bal = {});
  } else if (
    [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
      doc1.daccNo
    ) &&
    [200, 201, 209, 230, 231, 300, 311, 320, 330, 332, 350, 360].includes(
      doc1.caccNo
    )
  ) {
    var bool = true;

    var debitModel = new dmodel(debit); //Creation of debit Account
    var creditModel = new cmodel(credit); // Creation of credit Account
    var ledgerModel = new lemodel(balance); //Creation of a ledger
    const as = await bmodel
      .find({ accNo: { $in: [debit.accNo] } }, async function (err, acc) {
        //you must check the value > 0
        if (err) {
          console.log(err);
        }
        if (acc.length > 0 && debit.value + acc[0].mvalue <= acc[0].dvalue) {
          if ([200, 201, 209, 230, 231].includes(doc1.caccNo)) {
            await limodel
              .findOneAndUpdate(
                { accNo: { $in: [credit.accNo] } },
                { $inc: { value: credit.value } },
                {
                  new: true,
                  upsert: true,
                }
              )
              .exec(); //checked

            //else create

            //find acc in shareholder if found increment else add
          } else if (
            [300, 311, 320, 330, 332, 350, 360].includes(doc1.caccNo)
          ) {
            await shmodel
              .findOneAndUpdate(
                { accNo: { $in: [credit.accNo] } },
                { $inc: { value: credit.value } },
                {
                  new: true,
                  upsert: true,
                }
              )
              .exec(); //checked

            // update else create
          }

          if ([200, 201, 209, 230, 231].includes(doc1.daccNo)) {
            console.log(doc1.caccNo);
            await limodel
              .findOneAndUpdate(
                { accNo: { $in: [debit.accNo] } },
                { $inc: { value: -debit.value } }
              )
              .exec(); //checked

            //find acc in shareholder if found increment else add
          } else if (
            [300, 311, 320, 330, 332, 350, 360].includes(doc1.daccNo)
          ) {
            await shmodel
              .findOneAndUpdate(
                { accNo: { $in: [debit.accNo] } },
                { $inc: { value: -debit.value } }
              )
              .exec(); //checked
          }

          await bmodel
            .findOneAndUpdate(
              { $and: [{ accNo: debit.accNo }] },
              { $inc: { mvalue: debit.value } }
            )
            .exec()
            .then(
              (message +=
                " " + debit.name + " has been updated in the Balancesheet \n")
            );

          await bmodel
            .findOneAndUpdate(
              { $and: [{ accNo: credit.accNo }] },
              { $inc: { dvalue: credit.value, mvalue: 0 } },
              {
                new: true,
                upsert: true,
              }
            )
            .exec()
            .then(
              (message +=
                " " + credit.name + " has been updated in the Balancesheet \n")
            );
          //else create

          creditModel.save(function (err) {
            //Saving credit table
            if (err) console(err);
            // saved!
          });
          debitModel.save(function (err) {
            //Saving debit table
            if (err) console(err);
            // saved!
          });
          ledgerModel.save(function (err) {
            //Saving ledger table
            if (err) console(err);
            // saved!
          });

          // }else if(!acc)
          // {
          //  message+=" "+ma.name+" doesn't exist in balancesheet \n"
          // }
          // else if (ma.value+acc[0].mvalue>acc[0].dvalue){

          //  bool = false
          //   console.log(bool)

          //   console.log("Account value doesn't allow",acc[0].mvalue+ma.value+">"+acc[0].dvalue)
        } else {
          message +=
            "Attention: Account Doesn't exist Or " +
            debit.name +
            " value must be less than Or Equal " +
            (parseInt(acc[0].dvalue) - parseInt(acc[0].mvalue));
        }
      })
      .then(
        (message +=
          " " +
          debit.name +
          " And " +
          credit.name +
          bool +
          " has been Updated in balancesheet \n"),
        bool == false
          ? (message +=
              "Attention! Failed: Account value doesn't allow " +
              acc[0].mvalue +
              "+" +
              debit.value +
              ">" +
              acc[0].dvalue +
              "\n")
          : ""
      );

    if (message.length > 0) {
      res.status(200).json({
        message: message,
      });
    }

    message = "";
    debit, credit, balance, (bal = {});
  }
});
