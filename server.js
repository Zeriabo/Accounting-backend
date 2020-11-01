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

app.post("/emptydata",async function(re,res){
  await lemodel.deleteMany({});
  await asmodel.deleteMany({});
  await limodel.deleteMany({});
  await shmodel.deleteMany({});
  await cmodel.deleteMany({});
  await dmodel.deleteMany({});
  await bmodel.deleteMany({});
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
app.post("/savedata",function(req,res){ 

    var doc1 = { credit: req.body.credit,debit:req.body.debit ,caccNo:req.body.cAccNo,daccNo: req.body.dAccNo,dvalue:req.body.dvalue,cvalue:req.body.cvalue };

    //Need to insert to the leger for the Trail balance sheet!!!!!
const DD="Debit"; CC="Credit";
 const ma = {};
 const da = {};
 const ba = {};
 const bal={};

 ma.name=doc1.debit;
 ma.accNo=doc1.daccNo;
 ma.value=doc1.dvalue;
 
 da.name=doc1.credit;
 da.accNo=doc1.caccNo;
 da.value=doc1.cvalue;




 console.log(ma.name,da.name)

 ba.mname=doc1.debit;
 ba.dname=doc1.credit;
 ba.maccNo=doc1.daccNo;
 ba.daccNo=doc1.caccNo;
 ba.mvalue=doc1.dvalue;
 ba.dvalue=doc1.cvalue;
 var assetinsert,assetupdate,liabilityinsert,liabilityupdate,assetdecrement;

 // Asset insert and updates are correct credit and debit and ledger Okay Balancesheet find and update not found insert (for each)

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

   assetupdate=   asmodel.findOne({accNo: da.accNo}, function(err, dacc) {
   if(dacc!=null){
    if(dacc.length >0) { 
      asmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: -da.value},}, function (err, res) { //Update Assets
        if (err){ 
            console.log(err) 
            res.status(500).json({
              error: 'Technical error occurred'
          });
        } 
        else{ 
            console.log("Decrement of Assets Account: ", da.name);
            res.status(400).send('Assets Updated');
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
          else res.send("Assets has been Updated")
          // saved!
      });
      }
      else if(err){
              console.log(err)
            }
      });

    }
  
  }else if(dacc==null)
  {
    res.status(201).send('Credit Asset Account doesnt exist in Database Cant insert',da.name);
     console.log('Credit Asset Account doesnt exist in Database ',da.name);
  }
  
  else if(err){
          console.log(err)
        }
  });        
  mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {  
if(bacc) {
bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
  if (err){ 
      console.log(err) 
  } 
  else{ 
      console.log("Updated Docs of debit balancesheet : ", docs,ma.accNo);
      
  } 

});
}else if(!bacc){ 
  bal.accNo=ma.accNo;
  bal.accName=ma.accName;
  bal.mvalue=ma.value;
  bal.dvalue= 0;
  var bb= new bmodel(bal)
bb.save(function (err) {
 if (err) console(err);
 else console.log("Saved!")
 // saved!
});}

  });
  
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
      } 
    
    });
  }
  });
   
       

     
      

  }

 
// Asset is a debit and liability or Shareholder is the credit 
else  if(( [101,102,108,110,112,116,130,157,158].includes(doc1.daccNo )  
 
 &&  [200,201,209,230,231,300,311,320,330,332,350,360].includes(doc1.caccNo)   ))

 {  // we need to add the asset if not existed or update it and same for the liability or shareholder 
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
   asmodel.findOne({accNo: ma.accNo}, function(err, acc) {
    if(err){
      console.log(err)
    }else   if(acc) {
asmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
      if (err){ 
          console.log(err) 
      } 
      else{ 
          console.log("Updated Docs of debit account in Assets: ", ma.name,  docs); 
      } 
    
    });
   
   
}else if(!acc)
{
  var as = new asmodel(ma)
   assetinsert=   as.save(function (err) {
    if (err) console.log(err);
    // saved!
});
}

});
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
        
        });
      }else if (!acc){
        var li = new limodel(da)
        liabilityinsert=   li.save(function (err) {
          if (err) console.log(err);
          // saved!
      });
    }
    });
    
    
    

        
       
   //find acc in shareholder if found increment else add
      } else if([300,311,320,330,332,350,360].includes(doc1.caccNo))
          {
            
            shareholderUpdate=     shmodel.findOne({accNo:da.accNo}, function(err,acc){
               if(err){
                console.log(err)
              }
              else if(acc!=null)
              {
                shmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: da.value},}, function (err, docs) { //update Assets
                  if (err){ 
                      console.log(err) 
                  } 
                  else{ 
                      console.log("Updated Docs of Credit Shareholder : ",acc.name, docs); 
                  } 
                
                });
              }else if(!acc){
                var sh = new shmodel(da)
                liabilityinsert=    sh.save(function (err) {
                  if (err) console.log(err);
                  // saved!
              });
              }
             
            })
           
           
    
           
           
          }
//Now find the account in balancesheet and increment or decrement or add 
mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {
  if(bacc) {console.log("Found!");
  bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Updated Docs of debit balancesheet : ",ma.accNo,da.accNo, docs); 
    } 
  
  });
  }else if(!bacc){  bal.accNo=ma.accNo;
    bal.accName=ma.accName;
    bal.mvalue=ma.value;
    bal.dvalue= 0;
    var bb= new bmodel(bal)
  bb.save(function (err) {
   if (err) console(err);
   else console.log("Saved!")
   // saved!
  });}
  
    });
    
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
  
  
  
    }else if(!dacc){ bal.accNo=da.accNo;
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
  
    //debit is an liability or shareholder (-) and credit is an Assets (-) 
 
 }  if(([200,201,209,230,231,300,311,320,330,332,350,360].includes(doc1.daccNo)) && ([101,102,108,110,112,116,130,157,158].includes(doc1.caccNo)) )
 { 
  assetdecrement = asmodel.findOne({accNo: da.accNo}, function(err, acc) {
    if(acc && (acc.value-da.value>=0)) {
      asmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: da.value},}, function (err, docs) { //update Assets
        if (err){ 
            console.log(err);
           
        } 
        else{ 
            console.log("Updated Docs of Asset credit : ",da.accNo, docs); 
        } 
      
      });
     
     
  }else if(!acc)
  {
    console.log("Error: Account not found to decrement!")
    return;
  }
 
  });// Account is a liability account
if(assetdecrement)
{

  if([200,201,209,230,231].includes(doc1.daccNo))
  {
   
    //find acc in liabilties if found decrement else message
    limodel.findOne({accNo:ma.accNo}, function(err,acc){
      if(acc!=null && acc.value>=ma.value)
      {
   liabilityupdate =  limodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
          if (err){ 
              console.log(err) 
          } 
          else{ 
              console.log("Updated Docs of Credit Liabililty : ",acc.name, docs); 
          } 
        
        });
      }else if(acc.value<ma.value){
        console.log("ERROR: Account",acc.name," is < than ",ma.name)
        return;
    
      }else{
        console.log("ERROR: Account Not Found!  ")
        return;
    
      }
    });

   

  } // Account is a shareholder account
  else if([300,311,320,330,332,350,360].includes(doc1.daccNo))
         {
    liabilityupdate=      shmodel.findOne({accNo:ma.accNo}, function(err,acc){
      if (err){ 
        console.log(err) 
    } 
            if(acc!=null)
            {
              shmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { 
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log("Updated Docs : ", docs); 
                } 
              
              });
          
            
            }else{
              console.log("ERROR: Account NOT found!");
              return;
            }
          });
            }   

}
  
         
        
   
       if(liabilityupdate){
     
              var dm =new dmodel(ma);
              var cm = new cmodel(da);
           
              var lm = new lemodel(ba);
              bm.save(function (err) {
                if (err) console(err);
                // saved!
            });
            bal.accName=ma.accName;
            bal.mvalue=0;
            bal.dvalue= ma.value;
            var bb= new bmodel(bal)
          bb.save(function (err) {
           if (err) console(err);
           else console.log("Saved!")
           // saved!
          });
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
              } 
           
        
//Now find the account in balancesheet and increment or decrement or add 
mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) {
  if (err){ 
    console.log(err) 
} 
else  if(bacc) {console.log("Found!");
  bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Updated Docs of debit balancesheet : ",ma.accNo,da.accNo, docs); 
    } 
  
  });
  }else if(!bacc){  bal.accNo=ma.accNo;
    bal.accName=ma.accName;
    bal.mvalue=ma.value;
    bal.dvalue= 0;
    var bb= new bmodel(bal)
  bb.save(function (err) {
   if (err) console(err);
   else console.log("Saved!")
   // saved!
  });}
  
    });
    
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
  
  
  
    }else if(!dacc){ bal.accNo=da.accNo;
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
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
   res.setHeader('Access-Control-Allow-Origin', 'https://zaccounting.netlify.app/');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
 
});
