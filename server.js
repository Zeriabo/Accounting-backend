let express = require('express');
var path = require("path");  
var app = express(); 
const socketIO = require('socket.io');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const { exit } = require('process');
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
app.use(index);
const server = http.createServer(app);
const io = socketIO(server); 

let message = ''





app.use(cors());
// Express Route
function search(nameKey, myArray){
  for (var i=0; i < myArray.length; i++) {
    console.log(myArray[i])
      if (myArray[i].accNo == nameKey) {
          return myArray[i];
      }
  }
}

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
   useUnifiedTopology: true 
}).then(() => {
  console.log('Database  '+dbConfig.db,' sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

mongoose.set('useFindAndModify', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//app.use('/ledgers', ledgerRoute)
app.use(cors());
app.options('*', cors());
app.use(express.static('public'));  
app.use(bodyParser.json({limit:'5mb'}));    
app.use(bodyParser.urlencoded({extended:true, limit:'5mb'})); 

// PORT
const port = process.env.PORT || 4000;
//  app.listen(port, () => {
//   console.log('Connected to port ' + port)
// })

//listening on socket 

server.listen(port, () => console.log(`Listening on port ${port}`));

const Schema = mongoose.Schema;
var ResultBalanceSchema = new Schema({
    
  name: {
      type: String
}, 
  value: {
      type: Number
}
});
var accountSchema = new Schema({
    
  name: {
      type: String
  },
  accNo: {
    type: Number
},
  value: {
      type: Number
  }
});
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
});
var balanceSchema = new Schema({
    
  accNo: {
      type: Number
}, 
  
  mvalue: {
    type: Number
},dvalue: {
    type: Number
}
});
var lemodel = mongoose.model('Ledger',ledgerSchema,'Ledger')
var asmodel = mongoose.model('Assets', accountSchema,'Assets'); 
var limodel = mongoose.model('Liability',accountSchema,'Liabilities')
var shmodel = mongoose.model('ShareholderEquity',accountSchema,'ShareholdersEquity') 
var cmodel =mongoose.model('Credits',accountSchema,'Credit')
var dmodel =mongoose.model('Debit',accountSchema,'Debit')
var bmodel = mongoose.model('Balancesheet',balanceSchema,'Balancesheet')
var revmodel = mongoose.model('Revenues', accountSchema,'Revenues'); 
var expmodel = mongoose.model('Expenses', accountSchema,'Expenses'); 
var ibmodel = mongoose.model('Incomesheet',balanceSchema,'Incomesheet')

app.post("/emptydata",async function(re,res){
  await lemodel.deleteMany({});
  await asmodel.deleteMany({});
  await limodel.deleteMany({});
  await shmodel.deleteMany({});
  await cmodel.deleteMany({});
  await dmodel.deleteMany({});
  await bmodel.deleteMany({});
  await revmodel.deleteMany({});
  await expmodel.deleteMany({});
  await ibmodel.deleteMany({});
})

app.post("/intializeData",async function(req,res){
  await lemodel.deleteMany({});
  await asmodel.deleteMany({});
  await limodel.deleteMany({});
  await shmodel.deleteMany({});
  await cmodel.deleteMany({});
  await dmodel.deleteMany({});
  await bmodel.deleteMany({});
  const init= {name:"Bank/Cash at Bank",accNo:101,value:1000000}
  const init2= {name:"Owner Capital",accNo:300,value:1000000}
 const init2b={accNo:300,mvalue:0,dvalue:1000000}
  const initb= {accNo:101,mvalue:1000000,dvalue:0}
  var ls = new limodel(init2)
    ls.save(function (err,d) {
    if (err) console(err);
   else console.log(d)
});
var abl = new bmodel(init2b)
abl.save(function (err,d) {
if (err) console(err);
else console.log(d)
// saved!
});
  var as = new asmodel(init)
    as.save(function (err,d) {
    if (err) console(err);
   else console.log(d)
});

var ab = new bmodel(initb)
ab.save(function (err,d) {
if (err) console(err);
else console.log(d)
// saved!
});
})

app.post("/savedata",async function(req,res){ 

    var doc1 = { credit: req.body.credit,debit:req.body.debit ,caccNo:req.body.cAccNo,daccNo: req.body.dAccNo,dvalue:req.body.dvalue,cvalue:req.body.cvalue };
const data=res.body

    //Need to insert to the leger for the Trail balance sheet!!!!!
const DD="Debit"; CC="Credit";
 var ma = {};
 var da = {};
 var ba = {};
 var bal={};

 ma.name=doc1.debit;
 ma.accNo=doc1.daccNo;
 ma.value=doc1.dvalue;
 da.name=doc1.credit;
 da.accNo=doc1.caccNo;
 da.value=doc1.cvalue;






 ba.mname=doc1.debit;
 ba.dname=doc1.credit;
 ba.maccNo=doc1.daccNo;
 ba.daccNo=doc1.caccNo;
 ba.mvalue=doc1.dvalue;
 ba.dvalue=doc1.cvalue;
 var assetinsert,assetupdate,liabilityinsert,liabilityupdate,assetdecrement;
//IncomeStatement Insert into Revenue or Expenses and to the Assets or liability accounts
if( ([101,112].includes(doc1.daccNo ) )
 
&& ([400,410,420,430,570,585,595,597,599,631,711,722,726,729,732,905].includes(doc1.caccNo)   ))
//Expenses decrease in credit
{
      
 var dm =new dmodel(ma);
 var cm = new cmodel(da);

 var lm = new lemodel(ba);

cm.save(function (err) {
 if (err) console(err);
 // saved!
});
dm.save(function (err) {
if (err) console(err);
// saved!
});
lm.save(function (err) {
if (err) console(err);
// saved!
});
if(da.accNo>500)
{
  expmodel.findOne({accNo:da.accNo}, function(err,dacc){
    if(dacc!=null){
      if(dacc.length > 0){
        expmodel.updateOne({'accNo':{$in: [da.accNo]}},{$inc:{value:-da.value},},function(err,res){
          if(err){
            console.log(err) 
            res.status(500).json({
              error: 'Technical error occurred'
          });
        } else{ 
          res.send(body)
          res.status(201).json({
            message:'Post saved!'
          })
          console.log("Decrement of Expenses Account: ", da.name);
          res.status(400).json({message:'Expenses Updated'});
         res.status(201).json({
          message: 'Subscription saved.'
      });
      }  
        });
        asmodel.findOne({accNo: ma.accNo}, function(err, macc) {
          if( macc) {
        asmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
              if (err){ 
                res.status(500).json({
                  error: 'Technical error occurred'
              });
                 res.send(err)
              } 
              else{ 
                res.status(201).send(`Updated of Assets`);
                  console.log("Updated Docs of debit : ", docs);
                  res.setHeader('Content-Type', 'application/json'); 
                  res.status(200).json({docs:'Assets has been Updated'})
              } 
            
            });
           
            
        }else if(macc.length==0)
        {
          var as = new asmodel(ma)
           assetinsert=   as.save(function (err,res) {
            if (err) console(err);
            else res.status(200).send("Assets has been Updated")
            // saved!
        });
        }
        else if(err){
                console.log(err)
              }
        });
      }
    }
  })
}else if (da.accNo<500)
{
  revmodel.findOne({accNo:da.accNo}, function(err,dacc){
    if(dacc!=null){
      if(dacc.length > 0){
        expmodel.updateOne({'accNo':{$in: [da.accNo]}},{$inc:{value:da.value},},function(err,res){
          if(err){
            console.log(err) 
            res.status(500).json({
              error: 'Technical error occurred'
          });
        } else{ 
          console.log("Increment of Revenue Account: ", da.name);
          res.status(400).send('Revenue Updated');
         res.json({
          data: 'Subscription saved.'
      });
      }  
        });
        asmodel.findOne({accNo: ma.accNo}, function(err, macc) {
          if( macc) {
        asmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
              if (err){ 
                res.status(500).json({
                  error: 'Technical error occurred'
              });
                 res.send(err)
              } 
              else{ 
                res.status(201).send(`Updated of Assets`);
                  console.log("Updated Docs of debit : ", docs);
                  res.setHeader('Content-Type', 'application/json'); 
                  res.status(200).json({docs:'Assets has been Updated'})
              } 
            
            });
           
            
        }else if(macc.length==0)
        {
          var as = new asmodel(ma)
           assetinsert=   as.save(function (err,res) {
            if (err) console(err);
            else res.status(200).send("Assets has been Updated")
            // saved!
        });
        }
        else if(err){
                console.log(err)
              }
        });
      }
    }
  })
}
   
 mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {  
if(bacc) {
bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
 if (err){ 
     console.log(err) 
 } 
 else{ 
  res.status(200).send("Updated  balancesheet ");
     
 } 

});
}else if(!bacc){ 
 bal.accNo=ma.accNo;
 bal.accName=ma.accName;
 bal.mvalue=ma.value;
 bal.dvalue= 0;
 var bb= new bmodel(bal)
bb.save(function (err) {
if (err) res.status(500).send(err);
else console.log("Saved!")
// saved!
});}

 });
if(da.accNo>500)
{
  ibmodel.findOne({accNo: da.accNo}, function (err,dacc){
    //exp - rev +
   ibmodel.updateOne({'accNo':da.accNo},{$inc:{dvalue:da.value},},function(err,docs){
     if(err)
     {
       res.status(500).send(err)
     }else {
      // res.status(200).send("Updated in Incomesheet")
      console.log("Updated Docs of balanceshheet credit : ", docs); 
     }
   });
  })
} else{
  ibmodel.findOne({accNo: da.accNo}, function (err,dacc){
    //exp - rev +
   ibmodel.updateOne({'accNo':da.accNo},{$inc:{dvalue:-da.value},},function(err,docs){
     if(err)
     {
       res.status(500).send(err)
     }else {
      // res.status(200).send("Updated in Incomesheet")
      console.log("Updated Docs of balanceshheet credit : ", docs); 
     }
   });
  })

}
 dup= bmodel.findOne({accNo: da.accNo}, function(err, dacc) {
   if(dacc  && dacc.mvalue>=da.value+dacc.dvalue) {
         

   bmodel.updateOne({'accNo':da.accNo},{$inc: { dvalue: da.value},}, function (err, docs) { //Update balancesheeet
     if (err){ 
         console.log(err) 
     } 
     else{ 
         console.log("Updated Docs of balanceshheet credit : ", docs); 
        
     } 
   
   });  



 }else if(!dacc){  console.log("Transaction can't be Completed!") 

  // saved!
 }else if(dacc.mvalue+ma.value<da.value+dacc.dvalue)
 {
 
   bmodel.updateOne({'accNo': ma.accNo},{$inc: { dvalue: ma.value},}, function (err, docs) { //Update balancesheet
     if (err){ 
         console.log(err) 
     } 
     else{ 
         console.log("Can't be added the Credit is more than the Debit in the Database Rolled back Changes!: ", docs,ma.accNo); 
         res.status(404).send("Can't")
     } 
   
   });
 }
 });
  
      

    
     

 }

 //Asset inseert ands updates are correct credit and debit and ledger Okay Balancesheet find and update not found insert (for each)

  if( ([101,102,108,110,112,116,130,157,158].includes(doc1.daccNo ) )
 
 && ([101,102,108,110,112,116,130,157,158].includes(doc1.caccNo)   ))
 
 { 
  var dm =new dmodel(ma);
  var cm = new cmodel(da);
 
  var lm = new lemodel(ba);

cm.save(function (err) {
  if (err) console(err);
  // saved!
});
dm.save(function (err) {
if (err) console(err);
// saved!
});
lm.save(function (err) {
if (err) console(err);
// saved!
});

   creditAssetupdate= await  asmodel.findOne({accNo: da.accNo}, function(err, dacc) {
   if(dacc!=null){
    if(dacc.length >0) { 
      asmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: -da.value},}, function (err, res) { //Update Assets
        if (err){ 
           
          res.status(500).json({
            error: 'Technical error occurred'
        });
        } 
        else{  
      
          message+='Assets of '+da.name.toString()+' has been Updated \n'
                 
        } 
      
      }).then(message+=da.name.toString()+" Has been updated in Assets \n")
   }}}
  ).then(message+='Credit Account '+da.name.toString()+' is Decremented ! \n')    
 DebitAssetupdate=   await  asmodel.findOne({accNo: ma.accNo}, function(err, macc) {
        if( macc) {
      asmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
            if (err){ 
              res.status(500).json({
                error: 'Technical error occurred'
            });
               res.send(err)
            } 
            
          
          }).then(message+="Debit Asset "+ma.name.toString()+" is updated\n")
         
          
      }else if(macc ==null)
      {message+=("Debit Asset"+ma.name+" is Created\n")
        var as = new asmodel(ma)
         assetinsert=   as.save(function (err,res) {
          if (err) console(err)

      })
      }
      else if(err){
        res.status(500).json({
          error: 'Technical error occurred'
      });
            }
      })



  


  
   
   
  
  mup= await bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {  
if(bacc) {
  bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
  if (err){ 
    res.status(500).json({
      error: 'Technical error occurred'
  });
  } 
  else{
  
   // res.status(201).send('Ipdated Debits',ma.name.toString()); 
 //  assetupdate.then(  message+=(' '+ma.name.toString()+' was updated in Balancesheet \n'))
   
      
  } 

})
}else if(!bacc){ 
  bal.accNo=ma.accNo;
  bal.accName=ma.accName;
  bal.mvalue=ma.value;
  bal.dvalue= 0;
  var bb= new bmodel(bal)
bb.save(function (err) {
 if (err) console(err);

 
})


}

  }).then(message+=" "+ma.name+" has been updated in the BalanceSheet \n")
  
   bmodel.findOne({accNo: da.accNo}, function(err, dacc) {
    if(dacc  && dacc.mvalue>=da.value+dacc.dvalue) {
          

    bmodel.updateOne({'accNo':da.accNo},{$inc: { dvalue: da.value},}, function (err, docs) { //Update balancesheeet
      if (err){ 
          console.log(err) 
      } 
      else{ 
        
      } 
    
    });



  }else if(!dacc){ message+="Transaction can't be Completed! \n"

   // saved!
  }else if(dacc.mvalue+ma.value<da.value+dacc.dvalue)
  {
  
    bmodel.updateOne({'accNo': ma.accNo},{$inc: { dvalue: ma.value},}, function (err, docs) { //Update balancesheet
      if (err){ 
          console.log(err) 
      } 
      else{ 
        message+=("Credit of"+da.name+" is more than the Debit in the Database Rolled back Changes!"); 
      } 
    
    });
  }
  }).then(message+=" "+da.name+" has been updated in the BalanceSheet \n")
   
       
  res.status(200).json({
    message:message
  });
  console.log(message)  
  message = ''  
    console.log(ma)
    ma,da,ba,bal ={}
  }

 
// Asset is a debit and liability or Shareholder is the credit 
else  if(( [101,102,108,110,112,116,130,157,158].includes(doc1.daccNo )  
 
 &&  [200,201,209,230,231,300,311,320,330,332,350,360].includes(doc1.caccNo)   ))

 { 
  
   var dm =new dmodel(ma);//Creation of debit Account
   var cm = new cmodel(da); // Creation of credit Account
   var lm = new lemodel(ba);//Creation of a ledger

   cm.save(function (err) { //Saving credit table
   if (err) console(err);
   // saved!
});
dm.save(function (err) {//Saving debit table
if (err) console(err);
// saved!
});
lm.save(function (err) {//Saving ledger table
if (err) console(err);
// saved!
});
console.log(ma.value)
asmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
  if (err){ 
      console.log(err) 
  } else if(docs.nModified==0)
  {
    var as = new asmodel(ma)
       as.save(function (err) {
      if (err) console.log(err);
      else message+=" "+ma.name+" has been Created in the Assets table! \n"
      // saved!
  })
  }
  else{
    
      console.log("Updated Docs of debit account in Assets: ", ma.name); 
    
  } 

}).then(message+=" "+ma.name+" has been updated in the Assets \n" )


   if([200,201,209,230,231].includes(doc1.caccNo))
   {//find acc in liabilities if found increment else add
    
      limodel.findOne({accNo:da.accNo}, function(err,acc){
      if(err){console.log(err)}
      else if(acc!=null)
      {
        limodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: da.value},}, function (err, docs) { //update Assets
          if (err){ 
              console.log(err) 
          } 
          else{ 
    
              console.log("Updated Docs of Credit Liabililty : ",da.name, docs); 
          } 
        
        })
      }else if (!acc){
        var li = new limodel(da)
        liabilityinsert=   li.save(function (err) {
          if (err) console.log(err);
          else message+=" "+da.name+" has been Created in the Liabilities \n"
          // saved!
      })
    }
    }).then(message+=" "+da.name+" has been Updated in the Liabilities \n")
    
    
    

        
       
   //find acc in shareholder if found increment else add
      } else if([300,311,320,330,332,350,360].includes(doc1.caccNo))
          {
            
            
                shmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: da.value},}, function (err, docs) { //update Assets
                  if (err){ 
                      console.log(err) 
                  }else  if(docs.nModified==0){
                    var sh = new shmodel(da)
                  sh.save(function (err) {
                      if (err) console.log(err);
                      else console.log(" "+da.name+" has been Created in the Shareholders \n")
                      // saved!
                  });
                  } 
                  else if(docs){ 
                      console.log("Updated Docs of Credit Shareholder : ",da.name); 
                     
                  } 
                
                }).then(message+=" "+da.name+" has been updated in shareholders")
             
           
           
    
           
           
          }
//Now find the account in balancesheet and increment or decrement or add 
mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {
  if(bacc) {
  bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
    if (err){ 
        console.log(err) 
    } 
    else{ 
      message+=" "+ma.name+" has been updated in the Balancesheet \n"
        console.log("Updated Docs of debit balancesheet : ",ma.accNo,da.accNo, docs); 
    } 
  
  })
  }else if(!bacc){  bal.accNo=ma.accNo;
    bal.accName=ma.accName;
    bal.mvalue=ma.value;
    bal.dvalue= 0;
    var bb= new bmodel(bal)
  bb.save(function (err) {
   if (err) console(err);
   else message+=" "+ma.name+" has been Created in the Balancesheet \n"
   // saved!
  })
}
  
    });
    
    dup= bmodel.findOne({accNo: da.accNo}, function(err, dacc) {
      if(err){console.log(err)}
      if(dacc  ) {
            
  
      bmodel.updateOne({'accNo':da.accNo},{$inc: { dvalue: da.value},}, function (err, docs) { //Update balancesheeet
        if (err){ 
            console.log(err) 
        } 
        else{ 
          message+=" "+da.name+" has been updated in the Balancesheet \n"
            console.log("Updated Docs of balanceshheet credit : ",da.name); 
        } 
      
      })
  
  
  
    }else if(!dacc){ bal.accNo=da.accNo;
      bal.accName=da.accName;
      bal.mvalue=0;
      bal.dvalue= da.value;
      var bb= new bmodel(bal)
    bb.save(function (err) {
     if (err) console(err);
   
     else message+=" "+da.name+" has been Saved in the Balancesheet \n"
     // saved!
    })
  
  }
    });
  
   
    console.log(message)
    if(message.length>0)
    {res.status(200).json({
      message:message
    });}
    
    message = ''
    ma,da,ba,bal ={}  
     
     
 }  if(([200,201,209,230,231,300,311,320,330,332,350,360].includes(doc1.daccNo)) && ([101,102,108,110,112,116,130,157,158].includes(doc1.caccNo)) )
 {  
     var dm =new dmodel(ma);//Creation of debit Account
  var cm = new cmodel(da); // Creation of credit Account
  var lm = new lemodel(ba);//Creation of a ledger
 await bmodel.find({accNo:{$in: [da.accNo, ma.accNo]}}, async function(err, acc) {
    if(err){console.log(err)}
    if(acc.length>0) {
          
      await asmodel.findOneAndUpdate({'accNo': { $in: [da.accNo]}},{$inc: { value: -da.value},}).exec() //checked!
     
    
      if([200,201,209,230,231].includes(doc1.daccNo))
       {
        await  limodel.findOneAndUpdate({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}).exec() //checked
          
       
    
       //find acc in shareholder if found increment else add
          } else if([300,311,320,330,332,350,360].includes(doc1.daccNo))
              {
                  console.log(doc1.daccNo)
                  await  shmodel.findOneAndUpdate({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}).exec()//checked
        
    
              }

      // acc.forEach(elem=> (elem.accNo == da.accNo)?elem.dvalue+parseInt(da.value):elem.mvalue+ parseInt(ma.value) )
      // console.log(acc)
      //You need to filter the array to get the liability and assets
     // const liabilityAccount=[200,201,209,230.231]
      const liabilityAccount = acc.filter(acc => acc.accNo == (200||201||209||230||231))
      const assetAccount = acc.filter(acc => acc.accNo == (101||108||110||112||157||130))


   //  console.log(acc[0].mvalue,acc[0].accNo,ma.accNo)
        await  bmodel.updateOne({ $and: [{'accNo': assetAccount[0].accNo},{'mvalue':{$gte:parseInt(da.value) +assetAccount[0].dvalue}}]},
        {$inc: { dvalue: da.value},}).exec()//.then(message+=" "+ma.name+" has been updated in the Balancesheet \n")
          
        await  bmodel.updateOne({ $and: [{'accNo': liabilityAccount[0].accNo},{'dvalue':{$gte:parseInt(ma.value) +liabilityAccount[0].mvalue}}]},
        {$inc: { mvalue: ma.value},}).exec()//.then(message+=" "+da.name+" has been updated in the Balancesheet \n")

      
    cm.save(function (err) { //Saving credit table
      if (err) console(err);
      // saved!
    });
    dm.save(function (err) {//Saving debit table
    if (err) console(err);
    // saved!
    });
    lm.save(function (err) {//Saving ledger table
    if (err) console(err);
    // saved!
    });
    
   
    
    }else if(!acc)
    {
      message+=" "+ma.name+" doesn't exist in balancesheet \n"
    }
    
  }).then(message+=" "+ma.name+" And "+da.name+" has been Updated in balancesheet \n")

  
   
    console.log(message)
    if(message.length>0)
    {res.status(200).json({
      message:message
    });}
    
    message = ''
    ma,da,ba,bal ={}  
     
 /*********************************************************************************************
  * 
  * You need to be sure if liabilities or shareholder AND Assets exist the perform The action
  * 
  */
//  if([200,201,209,230,231].includes(doc1.daccNo))
//  {
   
//  liu= limodel.findOne({accNo:ma.accNo}, function(err,acc){
//     if(acc!=null && acc.value>=ma.value)
//     { 
//          limodel.findOneAndUpdate({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}, function (err, docs) { //update liabilities
//       if (err){ 
//           console.log(err) 
//       }
//       else{  
       
//           console.log("Updated Docs of Credit Liabililty : "+acc.name); 
//           msg+='!Account '+ma.name+' has been updated in liabilities\n'
//           /**********
//            * Insert to Debit table
//            */
//           var dm =new dmodel(ma);
//            /**********
//            * Insert to credit table
//            */       
//           var cm = new cmodel(da);
//            /**********
//            * Insert to ledger table
//            */
//           var lm = new lemodel(ba);

//         /*********
//          * Creating balance sheet Data
//          */
//         bal.accName=ma.accName;
//         bal.mvalue=0;
//         bal.dvalue= ma.value;
//      /***
//       * try to find the account in balance sheet and update it
//       */

//     bmodel.findOneAndUpdate({'accNo': { $in: [ma.accNo]}},{$inc: {value: -ma.value},}, function(err, docs){
//       if(docs == null)
//       {
//         var bb= new bmodel(bal)
//         bb.save(function (err) {
//         if (err) console(err);
//         else console.log("Saved!")
// // saved!
//       });
//       }
//       if(err){
//         console.log(err)
//       }
//       else{
//         console.log("Updated i balancesheet")
//         msg+='Updated in  balancesheet \n'
//       }

//     });
// // var bb= new bmodel(bal)
// // bb.save(function (err) {
// // if (err) console(err);
// // else console.log("Saved!")
// // // saved!
// // });
// cm.save(function (err) {
// if (err) console(err);
// // saved!
// });
// dm.save(function (err) {
// if (err) console(err);
// // saved!
// });
// lm.save(function (err) {
// if (err) console(err);
// // saved!
// });
//       } 
     
//     }).then(
//     message+='Updated'+ma.name+'\n')
    
//     } else if(acc.value<ma.value){
//       console.log("ERROR: Account",acc.name+" is < than "+ma.name)
//       msg+="Attention!: Account "+acc.name," is < than "+ma.name + "\n"
//     console.log("haan")
//       return;
//     }


//   }).then(console.log("finding Liability..."),(liu==null)?message+=" Attention! "+ma.name+" Account not exist \n":message+="Account will be updated \n")

 


//  }else if([300,311,320,330,332,350,360].includes(doc1.daccNo))
//  {

//   shmodel.findOneAndUpdate({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value}}, function (err, docs) { 
    
//         if (err){ 
//             console.log(err) 
//         } else  if(docs==null){console.log("docsnull")
//         message+=" Account not found!"
//       }
//         else{ 
//          bmodel.findOneAndUpdate({'accNo':{$in:[ma.accNo]}},{$inc:{mvalue: ma.value }}, function (err, docs) { 
    
//           if (err){ 
//               console.log(err) 
//           } else  {console.log("balancesheet updated")
//           message+=" Balance sheet!"
//         }})
//             console.log("Updated Docs : ",ma.name); 
//             message+=" Account "+ma.name+" is updated in Shareholder decremented by " +ma.value +"\n"
//             updated = true
//             var dm =new dmodel(ma);
// var cm = new cmodel(da);

// var lm = new lemodel(ba);

// bal.accName=ma.accName;
// bal.mvalue=0;
// bal.dvalue= ma.value;
// var bb= new bmodel(bal)

// cm.save(function (err) {
// if (err) console(err);
// // saved!
// });
// dm.save(function (err) {
// if (err) console(err);
// // saved!
// });
// lm.save(function (err) {
// if (err) console(err);
// // saved!
// });
//         } 
     
//       }).then(console.log(updated),(updated!=true)? message+="Attention! "+ma.name+" Account not exist! to update": message+=ma.name+" Account is updated")
  
    
    
//     } 
//     console.log(updated)
// //console.log((shu!=null)?(await shu).execPopulate:(await liu).execPopulate())
// if(updated)
// {
//   asmodel.findOne({accNo: da.accNo}, function(err, acc) {
//     if(acc && (acc.value-da.value>=0)) {
//       asmodel.findOneAndUpdate({'accNo': { $in: [da.accNo]}},{$inc: { value: -da.value},}, function (err, docs) { //update Assets
//         if (err){ 
//             console.log(err);
//         } 
//         else if (acc){ 
         
//             console.log("Updated Docs of Asset credit : ", da.name); 
         
           
//         } 
      
//       })
      
//   }else 
//   {
//     console.log("Error: Account not found to decrement!")
    
//     message+="Attention!: Account "+da.name+ " not found to decrement! \n"
//     return;
//   }
 
//   }).then(message+=msg) 
// }else {
//   console.log("can't Update")
// }

   
      
           
        

    
//     res.status(200).json({
//       message:message
//     });
    
//     message = ''
//     ma,da,ba,bal ={} 
          

       } 
      else if([200,201,209,230,231,300,311,320,330,332,350,360].includes(doc1.daccNo) && [200,201,209,230,231,300,311,320,330,332,350,360].includes(doc1.caccNo) )
             {
         // Account is a liability account
        if([200,201,209,230,231].includes(doc1.daccNo))
        {
        
          //find acc in liabilties if found decrement else message
  lipromise=   limodel.findOne({accNo:ma.accNo}, function(err,liabilityupdate){
    if (err){ 
      console.log(err) 
  } 
        else    if(liabilityupdate && liabilityupdate.value>=ma.value)
            {
              limodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log("Updated Docs of Debit Liabililty : ", docs); 
                    
                } 
              
              });
            }else{
             console.log(ma.accNo,ma.name," Not found to decrement! Or its smaller value")
            
             
          return;
          
            }
          });
      
         
         
        }
        else if([300,311,320,330,332,350,360].includes(doc1.daccNo))
               {
                lipromise=  shmodel.findOne({accNo:ma.accNo}, function(err,liabilityupdate){
                  if (err){ 
                    console.log(err) 
                } 
                else  if(liabilityupdate && liabilityupdate.value>=ma.value)
                  {
                    shmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { 
                      if (err){ 
                          console.log(err) 
                      } 
                      else{ 
                          console.log("Updated Docs of Shareholder : ", liabilityupdate.name,   docs); 
                      } 
                    
                    });
                
                  
                  }else{
                    console.log(ma.name," Not found to decrement!",liabilityupdate)
                    return;
                    
                  }
                });
              }   // Find liability and add it or Create it
       
           //this is the problem 
           if(liabilityupdate){
            if([200,201,209,230,231].includes(doc1.caccNo))
            {
             
              //find acc in liabilties if found decrement else message
              liabilityinsert=  limodel.findOne({accNo:da.accNo}, function(err,acc){
                
              if(acc!=null)
                {
                  limodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: da.value},}, function (err, docs) { //update Assets
                    if (err){ 
                        console.log(err) 
                    } 
                    else{ 
                        console.log("Updated Docs of Credit Liabililty : ",acc.name, docs); 
                    } 
                  
                  });
                }else {console.log("There is no ",da.accName)
                  var lii = new limodel(da)
                lii.save(function (err) {
                    if (err) console(err);
                    // saved!
                });
              
                }if(err){console.log(err)}
              });
          
             
          
            }      else if([300,311,320,330,332,350,360].includes(doc1.caccNo))
            {
              liabilityinsert=     shmodel.findOne({accNo:da.accNo}, function(err,acc){
                if(err) console.log(err)
               else if(acc!=null)
               {
                 shmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: da.value},}, function (err, docs) { 
                   if (err){ 
                       console.log(err) 
                   } 
                   else{ 
                       console.log("Updated Docs : ", docs); 
                   } 
                 
                 });
             
               
               }else{
                var sh = new shmodel(da)
                liabilityinsert=    sh.save(function (err) {
                  if (err) console(err);
                  // saved!
              });
                
               }
              });
           }      }
    
           
           if(liabilityinsert && liabilityupdate) { 
     
              var dm =new dmodel(ma);
              var cm = new cmodel(da);
        
              var lm = new lemodel(ba);
              bm.save(function (err) {
                if (err) console(err);
                else{console.log("inserted to Balancesheet")}
                // saved!
            });
            cm.save(function (err) {
              if (err) console(err);
              else{console.log("inserted to Credit")}
              // saved!
          });
          dm.save(function (err) {
            if (err) console(err);
            else{console.log("Inserted to debit")}
            // saved!
          });
          lm.save(function (err) {
            if (err) console(err);
            else{console.log("Inserted to ledger")}
            // saved!
          });


            }
            
           
           
           mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {
             if(err) {console.log(err);}
          
             else  if(bacc && bacc.mvalue>=ma.value) {
              console.log("Found!");
            bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
              if (err){ 
                  console.log(err) 
              } 
              else{ 
                  console.log("Updated Docs of debit balancesheet : ",ma.accNo,da.accNo, docs); 
              } 
            
            });
            }else if(!bacc) {console.log("Not found ! ")}else if(bacc.mvalue>=ma.value){console.log("Too small")}
            
              });
          if(mup)    {
            dup= bmodel.findOne({accNo: da.accNo}, function(err, dacc) {
              if(err){console.log(err)}
              if(dacc  ) {
                    
          
              bmodel.updateOne({'accNo':da.accNo},{$inc: { dvalue: da.value},}, function (err, docs) { //Update balancesheeet
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log("Updated Docs of balanceshheet credit : ", docs); 
                } 
              
              });  
          
          
          
            }else if(!dacc){ 
              bal.accNo=da.accNo;
              bal.accName=da.accName;
              bal.mvalue=0;
              bal.dvalue= da.value;
              var bb= new bmodel(bal)
            bb.save(function (err) {
             if (err) console(err);
             else console.log("Saved!")
             // saved!
            });}
            });

            
          }
             
            
            }
          });
        
app.post("/activateBalance",function(req,res){ 
   
    
    var doc1 = { name: req.body.credit,value:req.body.cvalue };

    console.log("doc:",doc1)

 const re = {};
re.name=doc1.name;
re.value=doc1.value;
re.save(function(err,result){ 
    if (err){ 
        console.log(err); 
    } 
    else{ 
        console.log("Balance",result) 
    } 
});

});
    
app.get("/getTrailBalance",async function(req,res){
      
    
        lemodel.find({}, (err, book) => {
            if (err) {
              res.send(err)

            }else if(book.length==0)
                    {                  
                        var responseObject = undefined;
                        res.status(404).send("There is No Data yet!")
                            
                    } else if(book.length>0) {
      
              res.send(book)  ;     
             
            }
        });
     
    
    });   
  
   

    app.get("/getBalance", async function(req,res){

    a=[];
   
 const  t= await   bmodel.aggregate([
           
      
        
        { 
          $project: { 
            _id:'$accNo',
            mvalue:'$mvalue',
            cvalue:"$dvalue",
          

          },
          
          
         
        },
        {
            $addFields:{
              Result: { "$subtract": ("$dvalue">"$mvalue")? ["$dvalue","$mvalue"]: ["$mvalue","$dvalue"]}
            }
         }
        ], (err, creditbook) => {
            if (err) {
                res.status(500).send(err)
            }else if(creditbook.length==0)
            {
               
                
                res.status(404).send("There is No Data yet!")
            } else {
               
              a.push(creditbook);  
           
           
            }

  
        });
 
              

 res.send(t)
         
            
    });
        

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
  
   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000/');
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
  
   res.setHeader('Access-Control-Allow-Origin', 'https://zaccounting.netlify.app/');
   res.setHeader('Access-Control-Allow-Origin', 'http://zaccounting.netlify.app/');
   //res.setHeader('Access-Control-Allow-Origin', '*'); // to enable calls from every domain 
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');



   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
 
});
