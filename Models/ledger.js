const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ledgerSchema = new Schema({
    
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
},{
    collection : 'Ledger'
});
module.exports = mongoose.model('Ledger',ledgerSchema)