//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract eVotingSystem{

    address public Administrator;
    uint256 public Registation_StartingTime;
    uint256 public Registation_EndTime;
    uint256 public Voting_EndTime;

    constructor(){
        Administrator = msg.sender;
        Registation_StartingTime = block.timestamp;
    }

    struct Voter{

        string adharNo;
        uint256 voteddAt;
    
    }

    struct Candidate{
        uint seqNo;
        string adharNo;
        uint256 voteCount;
        uint256 registeredAt;

    }

    mapping(uint256=>Voter)Voters;
    mapping(string=>uint256) public VotedTime;
    mapping(string=>bool)public VotersList;
    uint256 public NumberOfVoters=0;

   

    mapping(uint256=>Candidate)Candidates;
    mapping(string=>bool) public CandidatesList;
    uint256 public NumberOfCandidates=0;

    function SetEndTime (uint256 registation_EndTime, uint256 voting_EndTime )public{
        require(msg.sender==Administrator,"You have not access.");
        Registation_EndTime = registation_EndTime;
        Voting_EndTime = voting_EndTime;
    }
    
    function AddVoters(string memory _adharNo)public{
        require(msg.sender==Administrator,"You have not access.");
        require(Registation_EndTime>=block.timestamp,"Registration timing is overed");
        require(!VotersList[_adharNo],"Voter already added.");
        Voter storage voter = Voters[NumberOfVoters];
        // voter.valid_vote = true;
        voter.adharNo = _adharNo;
        // voter.registeredAt = block.timestamp;
        VotersList[_adharNo]=true;
        
        NumberOfVoters++;
    }

    function getVoters()public view returns(Voter[] memory){
        require(msg.sender==Administrator,"You have not access.");
        Voter[] memory allVoters = new Voter[](NumberOfVoters);
        for(uint i =0;i<NumberOfVoters;i++){
            Voter storage person = Voters[i];
            allVoters[i]=person;
        }
        return allVoters;
    }

    function AddCandidates(string memory _adharNo)public{
        require(msg.sender==Administrator,"You have not access.");
        require(Registation_EndTime>=block.timestamp,"Registration timing is overed");
        require(!CandidatesList[_adharNo],"Candidate already added.");
        Candidate storage candidate = Candidates[NumberOfCandidates];
        candidate.voteCount = 0;
        candidate.adharNo = _adharNo;
        candidate.registeredAt = block.timestamp;
        candidate.seqNo = NumberOfCandidates;
        CandidatesList[_adharNo]=true;
        NumberOfCandidates++;
    }

    function getCandidates()public view returns(Candidate[] memory){
        require(msg.sender==Administrator,"You have not access.");
        Candidate[] memory allCandidates = new Candidate[](NumberOfCandidates);
        for(uint i =0;i<NumberOfCandidates;i++){
            Candidate storage person = Candidates[i];
            allCandidates[i]=person;
        }
        return allCandidates;
    }

    function giveVote(string memory _adharNo, uint256 _candidateNo)public{
        require(msg.sender==Administrator,"You have not access.");
        require(Registation_EndTime<=block.timestamp,"Registration is going on.");
        require(Voting_EndTime>=block.timestamp,"Voting is closed.");
        require(VotersList[_adharNo],"You have already voted or not registerd.");
        require(0<=(_candidateNo) && _candidateNo<NumberOfCandidates,"Select valid Candidate.");
        Candidates[_candidateNo].voteCount++;
        VotedTime[_adharNo]=block.timestamp;
        VotersList[_adharNo]=false;
    }
}