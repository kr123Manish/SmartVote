const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();
const jwt = require("jsonwebtoken");
app.use(cors());
app.set('view engine','ejs','cors');

app.use(bodyParser.urlencoded({
	extended:true
}));

app.use(express.static("public"));

const secretKey= "6$3eae566878f32c8faf05a80#"; //it can be anything.

const Gov_Adhar_auth_Schema = {
 	adhar_number: String,
  name: String,
  mobile_number: String,
  date_of_birth:String,
  address:String,
  gender:String,
  image:String,
  email_id:String
};

const Gov_Adhar_admin_Schema = {
  admin_id:String,
  password:String,
  mobile_number:String
};

const Leader_Details_Schema = {
  adhar_number: String,
  higherQualifications:String,
  workInfo:String,
  group:String,
  party_url:String,
};


mongoose.connect("<DB Credentials>", {
        useNewUrlParser: "true",
 });

mongoose.connection.on("error", err => {
  console.log("err", err)
});

mongoose.connection.on("connected", (err, res) => {
  console.log("Database is connected");
});

const Gov_Adhar_auth = mongoose.model("gov_adhar_auth",Gov_Adhar_auth_Schema);
const Gov_Adhar_admin = mongoose.model("gov_adhar_admin",Gov_Adhar_admin_Schema);
const Leader_Details = mongoose.model("leader_details",Leader_Details_Schema);

app.post("/Gov_Adhar_auth/Add_Admin",(req,res)=>{

  const NewAdmin = new Gov_Adhar_admin({
    admin_id:req.body.Admin_id,
    password: req.body.Password,
    mobile_number: req.body.Mobile_number
  });

  Gov_Adhar_admin.findOne({admin_id:req.body.Admin_id},(err,result)=>{
      if (err) {
        res.send(err);
      }else{
        if(result){
          res.send(false);
        }else{
          NewAdmin.save((err)=>{
            if(err){
                res.send(err);
            }else{
                res.send(NewAdmin);
            }
          });
        }
      }
    });
    
});

app.post("/Gov_Adhar_auth/GetAdmin",(req,res)=>{
  const admin_id = req.body.admin_id;
  const password = req.body.password;
  Gov_Adhar_admin.findOne({"admin_id":admin_id},(err,result)=>{
    if(err){
      res.send("error is"+err);
    }else{
      if (result===null) {
        res.send({"error":"Your entered id is wrong."});
      }else{
        if(result['password']!==password){
          res.send({"error":"Your entered password is wrong."})
        }else{
          
          const authToken=jwt.sign({id:result.id} ,secretKey, {expiresIn:'300s'});
          res.send({
              "token":authToken,
              'status':true
          });
          // res.send(true);
        }
      }
    }
  })
});


app.post("/Gov_Adhar_auth/Add_New",(req,res)=>{
    
    const NewUser = new Gov_Adhar_auth({
      adhar_number: req.body.Adhar_number,
      name: req.body.Name,
      mobile_number: req.body.Mobile_number,
      date_of_birth: req.body.Date_of_birth,
      address: req.body.Address,
      gender: req.body.Gender,
      image: req.body.Image,
      email_id: req.body.Email_id,
    });
    // console.log(NewUser);
    Gov_Adhar_auth.findOne({adhar_number:req.body.Adhar_number},(err,result)=>{
      if (err) {
        res.send(err);
      }else{
        if(result){
          res.send({"error":"This Aadhar is already registered."});
        }else{
          NewUser.save((err)=>{
            if(err){
                res.send({"error":err});
            }else{
                // res.send(NewUser);
                res.send(true);
            }
          });
        }
      }
    });
    

});

app.get("/Gov_Adhar_auth/verifyToken",(req,res)=>{
  const authToken = req.headers['token'];
  jwt.verify(authToken,secretKey,(err,tokenData)=>{
    if(err){
      res.send(false);
    }else{
      res.send(true);;
    }
  })
});

app.get("/Gov_Adhar_auth/GetAll",(req,res)=>{
  
    
      // console.log("tokenData ",tokenData);
      Gov_Adhar_auth.find((err,result)=>{
        if(err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
    
 
  
});

app.get("/Gov_Adhar_auth/Filter",async(req,res)=>{
  const key = req.query.key;
  // key = key.text();
  // key = JSON.parse(key);
  let result =  await Gov_Adhar_auth.find(
    {"$or":[
          {Adhar_number:{$regex:key}},
          {mobile_number:{$regex:key}}
        ]
    });
    res.send(result);
  
})

app.post("/Gov_Adhar_auth/GetUser",(req,res)=>{
  const Adhar_number = req.body.Adhar_number;
  Gov_Adhar_auth.findOne({adhar_number:Adhar_number},(err,result)=>{
    if (err) {
      res.send(err);
    }else{
     if(result){
      res.send(result);
     }else{
      res.send(false);
     }
    }
  });
});
app.post("/Gov_Adhar_auth/GetMobile",(req,res)=>{
  const Adhar_number = req.body.Adhar_number;
  Gov_Adhar_auth.findOne({adhar_number:Adhar_number},(err,result)=>{
    if (err) {
      res.send(err);
    }else{
     if(result){
      res.send(result["mobile_number"]);
     }else{
      res.send(false);
     }
    }
  });
  
});

app.delete("/Gov_Adhar_auth/DeleteUser",function(req,res){
    const Adhar_number = req.body.Adhar_number;
    // console.log(Adhar_number);
    Gov_Adhar_auth.findOneAndDelete({adhar_number:Adhar_number},(err,result)=>{
        if(err){
            res.send(err);
        }else{
            if (result) {
              res.send(Adhar_number+ " : Successfully Deleted");
            }else{
              res.send(false);
            }
            
        }
    })
});


// for leader registraitons.
app.post("/Leader_Details/Add_New",(req,res)=>{
    
    const NewUser = new Leader_Details({
      adhar_number: req.body.Adhar_number,
      higherQualifications: req.body.HigherQualifications,
      workInfo: req.body.WorkInfo,
      group: req.body.Group,
      party_url: req.body.Party_url,
    });
    // console.log(NewUser);
    // res.send(NewUser);
    Leader_Details.findOne({adhar_number:req.body.Adhar_number},(err,result)=>{
      if (err) {
        res.send(err);
      }else{
        if(result){
          res.send({"error":"This Aadhar is already registered."});
        }else{
          NewUser.save((err)=>{
            if(err){
                res.send({"error":err});
            }else{
                // res.send(NewUser);
                res.send(true);
            }
          });
        }
      }
    });
    

});

app.post("/Leader_Details/Find_Candidate",(req,res)=>{
  adhar_number = req.body.Adhar_number;
      Leader_Details.findOne({adhar_number:req.body.Adhar_number},(err,result)=>{
      if (err) {
        res.send(err);
      }else{
        if(result){
          res.send({'success':result});
        }else{
          res.send(false);
        }
      }
    });
});
app.get("/Leader_Details/GetAll",(req,res)=>{
  
    
      // console.log("tokenData ",tokenData);
      Leader_Details.find((err,result)=>{
        if(err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
    
 
  
});

app.delete("/Leader_Details/DeleteCandidate",function(req,res){
    const Adhar_number = req.body.Adhar_number;
    // console.log(Adhar_number);
    Leader_Details.findOneAndDelete({adhar_number:Adhar_number},(err,result)=>{
        if(err){
            res.send(err);
        }else{
            if (result) {
              res.send(Adhar_number+ " : Successfully Deleted");
            }else{
              res.send(false);
            }
            
        }
    })
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server started at http://localhost:3000/");
})