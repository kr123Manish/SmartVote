const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var artifact = require('../build/contracts/eVotingSystem.json');

const abi = artifact.abi;
const networkId = Object.keys(artifact.networks)[0];
const contract_address = artifact["networks"][networkId]["address"];
let contractInstance = new web3.eth.Contract(abi, contract_address);
let owner = "";
(async () => {
    const accounts = await web3.eth.getAccounts();
    owner = accounts[0];
})();
module.exports = {

    getAccounts: async () => {
        const accounts = await web3.eth.getAccounts();
        return accounts;
    },

    getOwner: async () => {

        return owner;
    },

    getContractAddress: async () => {
        return contract_address;
    },

    getTimings: async () => {
        let Registation_StartingTime = await contractInstance.methods.Registation_StartingTime().call();
        let Registation_EndTime = await contractInstance.methods.Registation_EndTime().call();
        let Voting_EndTime = await contractInstance.methods.Voting_EndTime().call();
        return {
            "StartTime": Registation_StartingTime,
            "Registration_endTime": Registation_EndTime,
            "Voting_EndTime": Voting_EndTime
        };
    },

    getsCandidates: async () => {
        let candidates = await contractInstance.methods.getCandidates().call();
        return candidates;
    },

    getVoters: async () => {
        let voters = await contractInstance.methods.getVoters().call();
        return voters;
    },

    totalVotersCandidates: async () => {
        let candidates = await contractInstance.methods.NumberOfCandidates().call();
        let voters = await contractInstance.methods.NumberOfVoters().call();
        return {
            "NumberOfCandidates": candidates,
            "NumberOfVoters": voters
        }
    },

    setEndTime: async (registration_EndTime, voting_EndTime, ownerAccount) => {
        try {
            let x = await contractInstance.methods.SetEndTime(registration_EndTime, voting_EndTime).send({ from: ownerAccount });
            // console.log(x['status']);
            return "Timings have been set successfully.";
        } catch (err) {

            try {
                const key = Object.keys(err["data"])[0];
                const reason = err["data"][key]["reason"];
                console.log(err);
                return reason;
            } catch (e) {
                console.log(e);
                return "Server side error";
            }

        }
    },

    voterStatus: async (_adhar) => {
        try {
            const result = await contractInstance.methods.VotersList(_adhar).call();
            return result;
        } catch (e) {
            console.log(e);
            return "Server side error..";
        }
    },

    candidateStatus: async(_adhar)=>{
        try {
            const result = await contractInstance.methods.CandidatesList(_adhar).call();
            return result;
        } catch (e) {
            console.log(e);
            return "Server side error..";
        }
    },

    votedTime: async(_adhar)=>{
        try {
            const result = await contractInstance.methods.VotedTime(_adhar).call();
            return result;
        } catch (e) {
            console.log(e);
            return "Server side error..";
        }
    },

    addVoter: async (_adhar) => {
        try {
            
            let x = await contractInstance.methods.AddVoters(_adhar).send({ from: owner,gas: 200000 });
            console.log(x['status']);
            return "Voter added successfully.";
          
        } catch (err) {

            try {
                const key = Object.keys(err["data"])[0];
                const reason = err["data"][key]["reason"];
                console.log(err);
                return reason;
            } catch (e) {
                console.log(e);
                return "Server side error";
            }

        }
    },
    
    addCandidate: async (_adhar,ownerAccount) => {
        try {
            
            let x = await contractInstance.methods.AddCandidates(_adhar).send({ from: ownerAccount,gas: 200000 });
            console.log(x['status']);
            return "Candidate added successfully.";
          
        } catch (err) {

            try {
                const key = Object.keys(err["data"])[0];
                const reason = err["data"][key]["reason"];
                console.log(err);
                return reason;
            } catch (e) {
                console.log(e);
                return "Server side error";
            }

        }
    },
    
    giveVote: async (_adhar,_SeqNo) => {
        try {
            
            let x = await contractInstance.methods.giveVote(_adhar,_SeqNo).send({ from: owner,gas: 200000 });
            console.log(x['status']);
            return "Your vote added.";
          
        } catch (err) {

            try {
                const key = Object.keys(err["data"])[0];
                const reason = err["data"][key]["reason"];
                console.log(err);
                return reason;
            } catch (e) {
                console.log(e);
                return "Server side error";
            }

        }
    },



}