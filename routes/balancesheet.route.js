let mongoose = reuire('mongoose'),
express = require('express'),
route = express.Router();

let BalanceSchema = reuire('../Models/balance');

router.route('/create-student').post((req, res, next) => {
    studentSchema.create(req.body, (error, data) => {
      if (error) {
        return next(error)
      } else {
        console.log(data)
        res.json(data)
      }
    })
  });


new Schema({
    
    mname: {
        type: String
  }, 
    dname: {
        type: String
  },
    maccNo: {
      type: Number
  },daccNo: {
      type: Number
  },
    mvalue: {
        type: Number
  },dvalue: {
      type: Number
  }
});
