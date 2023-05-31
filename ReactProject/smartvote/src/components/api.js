module.exports = {
  getMobile: async (_adhar) => {
    //    console.log(_adhar)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_number", _adhar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    let result = await fetch("http://localhost:3000/Gov_Adhar_auth/GetMobile", requestOptions)
    result = await result.text();
    // console.log(result);
    return result;

  },

  getVoterData: async (_adhar) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_number", _adhar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    let result = await fetch("http://localhost:3000/Gov_Adhar_auth/GetUser", requestOptions)
    result = await result.text();
    return result;
  },

  addVoter: async (_adhar) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_Number", _adhar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    let result = await fetch("http://localhost:443/VotingApi/addVoter", requestOptions)
    result = await result.text();
    return result;


  },

  addCadidate: async (adhar, partyName, higherQualification, workInfo, partyLogo) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_number", adhar);
    urlencoded.append("HigherQualifications", higherQualification);
    urlencoded.append("WorkInfo", workInfo);
    urlencoded.append("Group", partyName);
    urlencoded.append("Party_url", partyLogo);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    let result = await fetch("http://localhost:3000/Leader_Details/Add_New", requestOptions);
    result = await result.text();
    return result;

  },

  getAdmin: async (id, password) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("admin_id", id);
      urlencoded.append("password", password);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      const result = await fetch("http://localhost:3000/Gov_Adhar_auth/GetAdmin", requestOptions);
      return result.text();


    } catch (e) {
      console.log(e);
      return ("Something went wrong.");
    }
  },

  getTime: async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/getTimings", requestOptions)
    return result.text();
  },

  convertTime: (millSecondTime) => {
    let time = parseInt(millSecondTime);
    // console.log(time)
    if (time === 0) {
      return "Have Not Set Yet.";
    } else {
      time = new Date(time * 1000);
      time = time.toString();
      time = time.split("GMT+0530");
      return time[0];
    }

  },

  setTime: async (reg_end_time, reg_end_date, voting_end_time, voting_end_date, contract_address) => {

    let Reg_end_time = reg_end_date + " " + reg_end_time;
    Reg_end_time = Date.parse(Reg_end_time) / 1000;
    let Voting_end_time = voting_end_date + " " + voting_end_time;
    Voting_end_time = Date.parse(Voting_end_time) / 1000;
    // console.log(Reg_end_time / 1000);
    // console.log(Voting_end_time / 1000);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("voting_EndTime", Voting_end_time);
    urlencoded.append("registration_EndTime", Reg_end_time);
    urlencoded.append("ownerAccount", contract_address);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/setEndTime", requestOptions)
    return result.text();

  },

  getAll: async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:3000/Leader_Details/GetAll", requestOptions)
    return result.text();
  },

  findCandidate: async (adhar) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_number", adhar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:3000/Leader_Details/Find_Candidate", requestOptions)
    return result.text();
  },

  getAge: (dob) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();

    return age;
  },

  reject: async (adhar) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_number", adhar);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:3000/Leader_Details/DeleteCandidate", requestOptions)
    return result.text();
  },

  addCadidateToBlock: async (ownerAccount, _adhar) => {
    // console.log(contractAddress);
    // console.log(selectedCadidate);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("OwnerAccount", ownerAccount);
    urlencoded.append("Adhar_Number", _adhar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/addCandidate", requestOptions)
    return result.text();
  },

  getRegisteredCandidate: async () => {
    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    let result = await fetch("http://localhost:443/VotingApi/getsCandidates", requestOptions);
    // console.log(await result.text());
    return result.text();
  },

  vote: async (_adhar, _id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_Number", _adhar);
    urlencoded.append("SeqNo", _id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/giveVote", requestOptions)
    return result.text();
  },

  voterStatus: async (adhar) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Adhar_Number", adhar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/voterStatus", requestOptions)
    return result.text();
  },

  result: async () => {
    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/getsCandidates", requestOptions)
    return result.text();
  },

  totalVotersAndCandidates: async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/totalVotersCandidates", requestOptions)
    return result.text();
  },

  getVoters: async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const result = await fetch("http://localhost:443/VotingApi/getVoters", requestOptions)
    return result.text();
  }
}