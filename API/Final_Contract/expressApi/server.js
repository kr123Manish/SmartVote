const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const app = express();
const conn = require("./connection");
const { result } = require("../../../smartvote/src/components/api");
app.use(cors());
app.set('view engine','ejs','cors');

app.use(bodyParser.urlencoded({
	extended:true
}));

app.use(express.static("public"));

app.get("/VotingApi/getAccounts",async(req,res)=>{
    let x = await conn.getAccounts();
    res.send(x);
});

app.get("/VotingApi/getOwner",async(req,res)=>{
    let x = await conn.getOwner();
    res.send(x);
});

app.get("/VotingApi/getContractAddress",async(req,res)=>{
    let x = await conn.getContractAddress();
    res.send(x);
});

app.get("/VotingApi/getTimings",async(req,res)=>{
    let x = await conn.getTimings();
    res.send(x);
});

app.get("/VotingApi/getsCandidates",async(req,res)=>{
    let x = await conn.getsCandidates();
    res.send(x);
});

app.get("/VotingApi/getVoters",async(req,res)=>{
    let x = await conn.getVoters();
    res.send(x);
});

app.get("/VotingApi/totalVotersCandidates",async(req,res)=>{
    let x = await conn.totalVotersCandidates();
    res.send(x);
});

app.post("/VotingApi/setEndTime",async(req,res)=>{
    const voting_EndTime = req.body.voting_EndTime;
    const registration_EndTime = req.body.registration_EndTime;
    const ownerAccount = req.body.ownerAccount;
    let x = await conn.setEndTime(registration_EndTime,voting_EndTime,ownerAccount);
    res.send(x);
});

app.post("/VotingApi/voterStatus",async(req,res)=>{
    const Adhar_Number = req.body.Adhar_Number;
    let x = await conn.voterStatus(Adhar_Number);
    res.send(x);
});

app.post("/VotingApi/candidateStatus",async(req,res)=>{
    const Adhar_Number = req.body.Adhar_Number;
    let x = await conn.candidateStatus(Adhar_Number);
    res.send(x);
});

app.post("/VotingApi/votedTime",async(req,res)=>{
    const Adhar_Number = req.body.Adhar_Number;
    let x = await conn.votedTime(Adhar_Number);
    res.send(x);
});

app.post("/VotingApi/addVoter",async(req,res)=>{
    const Adhar_Number = req.body.Adhar_Number;
    let x = await conn.addVoter(Adhar_Number);
    res.send(x);
});

app.post("/VotingApi/addCandidate",async(req,res)=>{
    const Adhar_Number = req.body.Adhar_Number;
    const OwnerAccount = req.body.OwnerAccount;
    let x = await conn.addCandidate(Adhar_Number,OwnerAccount);
    res.send(x);
});

app.post("/VotingApi/giveVote",async(req,res)=>{
    const Adhar_Number = req.body.Adhar_Number;
    const SeqNo = req.body.SeqNo;
    // console.log(Adhar_Number,SeqNo);
    let x = await conn.giveVote(Adhar_Number,SeqNo);
    res.send(x);
});




app.listen(process.env.PORT || 443,function(){
    console.log("Server started at http://localhost:443/");
})