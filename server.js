let express = require('express');
var path = require("path");  
var app = express(); 

let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const { LegendPosition } = require('ag-grid-community');

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
 app.listen(port, () => {
  console.log('Connected to port ' + port)
})



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
  const initl= {name:"Bank/Cash at Bank",accNo:101,value:1000000}
  const initb= {accNo:101,mvalue:1000000,dvalue:0}

  var as = new asmodel(init)
    as.save(function (err,d) {
    if (err) console(err);
   else console.log(d)
});
var al = new limodel(initl)
al.save(function (err,d) {
if (err) console(err);
else console.log(d)
// saved!
});
var ab = new bmodel(initb)
ab.save(function (err,d) {
if (err) console(err);
else console.log(d)
// saved!
});
})
app.post("/savedata",function(req,res){ 
   
    var find =false;
    var doc1 = { credit: req.body.credit,debit:req.body.debit ,caccNo:req.body.cAccNo,daccNo: req.body.dAccNo,dvalue:req.body.dvalue,cvalue:req.body.cvalue };

    //console.log("doc:",doc1)
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



 

 ba.mname=doc1.debit;
 ba.dname=doc1.credit;
 ba.maccNo=doc1.daccNo;
 ba.daccNo=doc1.caccNo;
 ba.mvalue=doc1.dvalue;
 ba.dvalue=doc1.cvalue;
 var assetinsert,assetupdate,liabilityinsert,liabilityupdate,assetdecrement,balancesheet;

 // Asset insert and updates are correct credit and debit and ledger Okay Balancesheet find and update not found insert (for each)

  if( ([101,102,108,110,112,116,130,157,158].includes(doc1.daccNo ) )
 
 && ([101,102,108,110,112,116,130,157,158].includes(doc1.caccNo)   ))
 
 {
   

   assetupdate=   asmodel.findOne({accNo: da.accNo}, function(err, dacc) {
   
    if(dacc!== null) { 
      asmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: -da.value},}, function (err, docs) { //Update Assets
        if (err){ 
            console.log(err) 
        } 
        else{ 
            console.log("Updated Docs of credit : ", docs); 
        } 
      
      });  
      asmodel.findOne({accNo: ma.accNo}, function(err, macc) {
        if( macc) {
      asmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: ma.value},}, function (err, docs) { //update Assets
            if (err){ 
                console.log(err) 
            } 
            else{ 
                console.log("Updated Docs of debit : ", docs); 
            } 
          
          });
         
          
      }else if(!macc)
      {
        var as = new asmodel(ma)
         assetinsert=   as.save(function (err) {
          if (err) console(err);
          // saved!
      });
      }
      else if(err){
              console.log(err)
            }
      });
     
    if(assetinsert || assetupdate){
     
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
    } 
  
  }else if(dacc==null)
  {
     console.log('Credit Asset Account doesnt exist in Database ',da.name);
  }
  
  else if(err){
          console.log(err)
        }
  });        
  mup= bmodel.findOne({accNo: ma.accNo}, function(err, bacc) { //finding credit account in balancesheet 
if(bacc) {console.log("Found!");
bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: ma.value},}, function (err, docs) { //Update balancesheet
  if (err){ 
      console.log(err) 
  } 
  else{ 
      console.log("Updated Docs of debit balancesheet : ", docs,ma.accNo); 
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
    if(dacc  && dacc.mvalue>=da.value+dacc.dvalue) {console.log("can be added!")
          

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
  });}else if(dacc.mvalue+ma.value<da.value+dacc.dvalue)
  {
  
    bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: -ma.value},}, function (err, docs) { //Update balancesheet
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

 { 
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
else if(err){
        console.log(err)
      }
});
   if([200,201,209,230,231].includes(doc1.caccNo))
   {//find acc in liabilities if found increment else add
    
     liabilityupdate= limodel.findOne({accNo:da.accNo}, function(err,acc){
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
    
    
    
    
    if(liabilityinsert || liabilityupdate){
     
      var dm =new dmodel(ma);
      var cm = new cmodel(da);
     
      var lm = new lemodel(ba);
    
    cm.save(function (err) {
      if (err) console.log(err);
      // saved!
  });
  dm.save(function (err) {
    if (err) console.log(err);
    // saved!
  });
  lm.save(function (err) {
    if (err) console.log(err);
    // saved!
  });
      } 
        
       
   //find acc in shareholder if found increment else add
      } else if([300,311,320,330,332,350,360].includes(doc1.caccNo))
          {
            
            liabilityupdate=     shmodel.findOne({accNo:da.accNo}, function(err,acc){
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
           
           

            if(liabilityinsert || liabilityupdate){
     
              var dm =new dmodel(ma);
              var cm = new cmodel(da);
           
              var lm = new lemodel(ba);
          
            cm.save(function (err) {
              if (err) console.log(err);
              // saved!
          });
          dm.save(function (err) {
            if (err) console.log(err);
            // saved!
          });
          lm.save(function (err) {
            if (err) console.log(err);
            // saved!
          });
              } 
           
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
      asmodel.updateOne({'accNo': { $in: [da.accNo]}},{$inc: { value: -da.value},}, function (err, docs) { //update Assets
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
  else if(err){
          console.log(err)
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
   liabilityupdate =  limodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}, function (err, docs) { //update Assets
          if (err){ 
              console.log(err) 
          } 
          else{ 
              console.log("Updated Docs of Credit Liabililty : ",acc.name, docs); 
          } 
        
        });
      }else if(value<ma.value){
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
              shmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}, function (err, docs) { 
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
              limodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}, function (err, docs) { //update Assets
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
                    shmodel.updateOne({'accNo': { $in: [ma.accNo]}},{$inc: { value: -ma.value},}, function (err, docs) { 
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
            bmodel.updateOne({'accNo': ma.accNo},{$inc: { mvalue: -ma.value},}, function (err, docs) { //Update balancesheet
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
    
app.get("/getTrailBalance",function(req,res){
      
    
        lemodel.find({}, (err, book) => {
            if (err) {
                res.status(500).send()
            }else if(book.length==0)
                    {
                       
                        var responseObject = undefined;
                        res.status(404).send(responseObject)
                    } else if(book.length>0) {
               
         console.log("This is it :",book)
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
               
                var responseObject = undefined;
                res.status(404).send(responseObject)
            } else {
               
              a.push(creditbook);  
           
           
            }

  
        });
 
              
 console.log(t)
 res.send(t)
         
            
    });
        

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

 