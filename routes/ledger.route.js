let mongoose = require('mongoose'),
express = require('express'),
router = express.Router();



let led = require('../Models/ledger');

router.route('/savedata').post((req, res, next) => {
  led.create(req.body, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      console.log(data)
      res.json(data)
      res.send("item has been saved")
    }
  })
});
// let asset = require('../Models/account');
// let liabilities = require('../Models/account');
// let shareholderEquity = require('../Models/account');
// let credit = require('../Models/account');
// let debit = require('../Models/account');
// let balancesheet = require('../Models/balance');



// app.post('http://localhost:4000/savedata', function (req, res) {

//   res.send('POST request to the homepage')
// })
// router.route('http://localhost:4000/savedata').post((req, res, next) => {
      
//     var doc1 = { credit: req.body.credit,debit:req.body.debit ,caccNo:req.body.cAccNo,daccNo: req.body.dAccNo,dvalue:req.body.dvalue,cvalue:req.body.cvalue };

//     console.log("doc:",doc1)
// const DD="Debit"; CC="Credit";
//  const ma = {};
//  const da = {};
//  const ba = {};

//  ma.name=doc1.debit;
//  ma.accNo=doc1.daccNo;
//  ma.value=doc1.dvalue;
 
//  da.name=doc1.credit;
//  da.accNo=doc1.caccNo;
//  da.value=doc1.cvalue;

//  ba.mname=doc1.debit;
//  ba.dname=doc1.credit;
//  ba.maccNo=doc1.daccNo;
//  ba.daccNo=doc1.caccNo;
//  ba.mvalue=doc1.dvalue;
//  ba.dvalue=doc1.cvalue;

// console.log("ba",ba)
//  if( ([101,102,108,110,112,116,130,157,158].includes(doc1.daccNo ) || [200,201,209,230,231].includes(doc1.daccNo) )
 
//  && ([101,102,108,110,112,116,130,157,158].includes(doc1.caccNo) || [200,201,209,230,231].includes(doc1.caccNo)  )  )
 
//  {


//     var mod = new asset(ma);
//     var bod = new debit(ma);
//     var dod = new liabilities(da);
//     var cod = new credit(da);
//     var aod = new balancesheet(ba);
//    var le = new led(ba);
    
 
//  }else  if( [101,102,108,110,112,116,130,157,158].includes(doc1.daccNo )  
 
//  &&  [300,311,320,330,332,350,360].includes(doc1.caccNo)   )
 
//  {


//     var mod = new asset(ma);
//     var bod = new debit(ma);
//     var dod = new shareholderEquity(da);
//     var cod = new credit(da);
//     var aod = new balancesheet(ba);
//     var le = new led(ba);
   
    
 
//  }else if([300,311,320,330,332,350,360].includes(doc1.daccNo) && [101,102,108,110,112,116,130,157,158].includes(doc1.caccNo) )
//  {
   

//    var mod = new asset(ma);
//    var bod = new debit(ma);
//    var dod = new liabilities(da);
//    var cod = new credit(da);
//    var aod = new balancesheet(ba);
//    var le = new led(ba);
//  }
//  mod.create(req.body, (error, data) => {
//   if (error) {
//     return next(error)
//   } else {
//     console.log(data)
//     res.json(data)
//   }
// })

// // READ ledger
// router.route('/').get((req, res) => {
//     led.find((error, data) => {
//       if (error) {
//         return next(error)
//       } else {
//         res.json(data)
//       }
//     })
//   })

//  // Get Account info
// router.route('/getaccount/:accno').get((req, res) => {
//     balancesheet.find(mname==req.params.accno || dname==req.params.accno, (error, data) => {
//       if (error) {
//         return next(error)
//       } else {
//         res.json(data)
//       }
//     })
//   })
   
//   });



// Update Account
router.route('/update-student/:id').put((req, res, next) => {
    studentSchema.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.json(data)
        console.log('Student updated successfully !')
      }
    })
  })
  
  // Delete Student
  router.route('/delete-student/:id').delete((req, res, next) => {
    studentSchema.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  })
  
  module.exports = router;