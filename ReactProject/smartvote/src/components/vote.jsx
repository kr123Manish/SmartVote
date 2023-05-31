import React, { useEffect, useState } from "react";
import "./App.css";
import Slid from "./Slid_nav";
import api from "./api";

function Vote() {
  const [viewMore, updateViewMore] = useState(false);
  const [cadidate, updateCadidate] = useState([]);
  const [selectedCadidate, updateSelectedCadidate] = useState([]);
  const [registrationGoing, updateRegistraionGoing] = useState(false);
  const [votingTiming, updateVotingTiming] = useState(true);
  const [eligibility, updateEligibility] = useState(true);

  const toggle = (e) => {
    if (viewMore) {

      updateViewMore(false);
    } else {
      GetCadidate(e.target.id);
      updateViewMore(true);
    }
  };
  useEffect(() => {
    Status();
    GetRegisteredCandidate();
  }, []);

  const GetRegisteredCandidate = async () => {
    const chain_data = await api.getRegisteredCandidate();
    const chian_jsonData = await JSON.parse(chain_data);
    // console.log("chain_data",chain_data);
    for (let i = 0; i < chian_jsonData.length; i++) {

      const seqNo = chian_jsonData[i][0];
      const adhar = chian_jsonData[i][1];
      // console.log(adhar);
      const adhar_data = await api.getVoterData(adhar);
      const jsonAdhar_data = await JSON.parse(adhar_data);
      // console.log(jsonAdhar_data);
      let age = api.getAge(jsonAdhar_data['date_of_birth']);

      const political_data = await api.findCandidate(adhar);
      const jsonPolitical_data = await JSON.parse(political_data);
      // console.log(jsonPolitical_data);

      updateCadidate((previousValue) => {
        return [...previousValue, {
          'seqNo':seqNo,
          'adhar_number': adhar,
          'name': jsonAdhar_data['name'],
          'party_name': jsonPolitical_data['success']['group'],
          'age': age,
          'higherQualifications': jsonPolitical_data['success']['higherQualifications'],
          'workInfo': jsonPolitical_data['success']['workInfo'],
          'party_url': jsonPolitical_data['success']['party_url'],
          'img_url': jsonAdhar_data['image'],
        }]
      });

    }

  }

  const GetCadidate = (adhar) => {
    // console.log(adhar);
    let result = cadidate.filter(item => item.adhar_number.toLowerCase().includes(adhar.toLowerCase()));
    updateSelectedCadidate(result[0]);
    // console.log(result[0]);
  }

  const Vote = async (e) => {
    const _id = e.target.id;
     const _adhar = localStorage.getItem("user_adhar");
    //  console.log(_id);
    let result = await api.vote(_adhar,_id);
    // result = JSON.parse(result);
    if(result==="Your vote added."){
      alert("Your vote added successfully.");
      updateEligibility(false);
    }
    // console.log(result);

  }

  const Status = async () => {
    let currentTimeStramp = Date.now() / 1000;
    let chainTimings = await api.getTime();
    chainTimings = JSON.parse(chainTimings);
    // console.log(chainTimings);
    let Registration_endTime = chainTimings['Registration_endTime'];
    let Voting_EndTime = chainTimings['Voting_EndTime'];
    // console.log(api.convertTime(timeStramp));
    if (currentTimeStramp < Registration_endTime) {
      // console.log("Registrtion is going on.");
      updateRegistraionGoing(true);
    }
    if(currentTimeStramp > Voting_EndTime){
      updateVotingTiming(false);
    }
    let result = await api.voterStatus(localStorage.getItem("user_adhar"));
    result = JSON.parse(result);
    if(!result){
      updateEligibility(false);
    }
  }


  if (registrationGoing) {
    return(
      <div>
        <Slid/>
        <div className="contract-verification error"><h2>Registration Is Still Going On.</h2></div>
      </div>
    )
  }

  if (!votingTiming) {
    return(
      <div>
        <Slid/>
        <div className="contract-verification error"><h2>Voting is closed.</h2></div>
      </div>
    )
  }

  else if(!eligibility){
    return(
      <div>
        <Slid/>
        <div className="contract-verification error"><h2>You Have Already Voted Or May Not be Registered.</h2></div>
      </div>
    )
  }
  else {
    return (
      <div>
        <Slid />
        <div>
          {/* search bar */}
          <div className="search-bar">
            <form>
              <input
                type="search"
                id="mySearch"
                name="q"
                placeholder="Search the site…" />
              <button className="btn-search" >Search</button>
            </form>
          </div>

          {!viewMore ? <div className="voter-candidates">

            {cadidate.length == 0 ? <h2>Candidate have not Registered yet !</h2> : cadidate.map((person, index) => <div key={index} className="candidate-card">
              <div className="card-img">
                <img
                  src={person.img_url}
                  width={"150rem"}
                  id="can-logo-img"
                  height={"150rem"}
                  alt="card-img"
                />
              </div>
              <div className="card-name">
                <span>Name - {person.name}</span>
              </div>
              <div className="party-name">
                <h2>Party: {person.party_name}</h2>
              </div>
              <button className="btn-reg vote" id={person.seqNo} onClick={Vote}>Vote</button>
              <div onClick={toggle} id="myBtn" className="party-info">
                <a href="#" id={person.adhar_number}>view more</a>
              </div>
            </div>)}


          </div> : <div className="popup">
          <div className="popup-content">
          <div className="popup-title">
            <p>Candidate Information</p>
            <span className="close" onClick={toggle}>
              &times;
            </span>
            
          </div>
      
          <div className="voter-resiter-data">
          <div className="voter-top">
            <div className="vote-img">
              <img
              
                src={selectedCadidate.img_url}
                alt="img"
                id="voter-img"
                width={"200rem"}
                height={"200rem"}
              />
            </div>
            <div className="data-input">
              <div className="input-data">
                <span className="in-text">Name - {selectedCadidate.name}</span>
              </div>
              
              <div className="input-data">
                <span className="in-text">Gender - {selectedCadidate.gender}</span>
              </div>

              <div className="input-data">
                <span className="in-text">Age - {selectedCadidate.age} Years</span>
              </div>
            </div>
            {/* small inputs */}
          </div>
          
          
          {/* line */}
          <div className="line"></div>
          {/* upload data */}
          <div className="candidate">

            <div className="cadidate-img-up">
              <img
              src={selectedCadidate.party_url}
              alt="img"
              id="can-logo-img"
              width={"100rem"}
              height={"100rem"}
            />
            </div>
            <div className="can-upd-data">

              <div className="candidate-up">
                <form>
                  <label htmlFor="Party name">Party Name</label>
                  <br />
                  <input
                    type="text"
                    name="partyName"
                    id="text"
                    placeholder="Your party name"
                    value={selectedCadidate.party_name}
                    readOnly
                    required
                  />
                </form>
              </div>
              <div className="candidate-party">
                <form>
                  <label htmlFor="name">Higher qualification</label> <br />
                  <input
                    type="text"
                    name="higherQualification"
                    id="text"
                    placeholder="Your qualification"
                    value={selectedCadidate.higherQualifications}
                    readOnly
                    required
                  />
                </form>
              </div>
            </div>
          </div>
          {/* Data */}
          <div className="work-input">
            <form>
              <label htmlFor="name">Your Work info</label> <br />
              <textarea
                type="text"
                name="workInfo"
                id="text"
                rows="3"
                placeholder="Work info"
                value={selectedCadidate.workInfo}
                readOnly
                required
              />
            </form>
          </div>
        </div>
        </div>
          </div>}

        </div>

      </div>

    );
  }
}

export default Vote;
