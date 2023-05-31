import { React, useEffect, useState } from "react";
import AdminNav from "./admin_nav";
import "./admin.css";
import "../components/App.css";
import api from "../components/api";
import { useNavigate } from "react-router-dom";
import DeleteImage from "../components/deleteImage";

function CandVerifi() {
  const Navigate = useNavigate();
  const [viewMore, updateViewMore] = useState(false);
  const [contractVerificationToogle, updateContractVerificationToogle] = useState(false);
  const [cadidate, updateCadidate] = useState([]);
  const [selectedCadidate, updateSelectedCadidate] = useState([]);
  const [contractAddress, updateContractAddress] = useState([]);
  const [error,updateError] = useState();
  const [success, updateSuccess] = useState();
  const toggle = (e) => {
    if (viewMore) {
        updateViewMore(false);
    } else {
      GetCadidate(e.target.id);
      updateViewMore(true);
    }
  };

  const contractToogle = (e)=>{
    
    if(contractVerificationToogle){
      updateSelectedCadidate("");
      updateError("");
      updateSuccess("");
      updateContractVerificationToogle(false);
    }else{
      
      let adhar_no = e.target.value;
      // console.log(adhar_no);
      updateSelectedCadidate(adhar_no);
      // console.log(adhar_no);
      updateContractVerificationToogle(true);
    }
  }
  useEffect(() => {
    GetAll();
  }, []);

  const GetAll = async () => {
    const data = await api.getAll();
    const jsonData = await JSON.parse(data);
    for (let i = 0; i < jsonData.length; i++) {
      // console.log(jsonData[i]['gender']);
      const adhar_data = await api.getVoterData(jsonData[i]['adhar_number']);
      const jsonAdhar_data = await JSON.parse(adhar_data);
      let age = api.getAge(jsonAdhar_data['date_of_birth']);


      updateCadidate((previousValue) => {
        return [...previousValue, {
          'adhar_number': jsonData[i]['adhar_number'],
          'name': jsonAdhar_data['name'],
          'party_name': jsonData[i]['group'],
          'gender': jsonAdhar_data['gender'],
          'age': age,
          'higherQualifications': jsonData[i]['higherQualifications'],
          'workInfo': jsonData[i]['workInfo'],
          'party_url': jsonData[i]['party_url'],
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

  const UpdateContractOnchange = (e) =>{
    updateContractAddress((previous)=>{
      return [e.target.value];
    })
  }
  const Accept = async(e) => {
    e.preventDefault();
    let result = await api.addCadidateToBlock(contractAddress[0],selectedCadidate);
    if(result === "Candidate added successfully."){
      updateSuccess(result);
    }else{
      updateError(result);
    }
  }

  const Reject = async (e) => {
    const adhar = e.target.value;
    GetCadidate(adhar);
    let result = cadidate.filter(item => item.adhar_number.toLowerCase().includes(adhar.toLowerCase()));
    const data = await api.reject(adhar);
    await DeleteImage(result[0].party_url);
    // alert(data);
    result = window.confirm(data);

  // Check the user's choice
  if (result) {
    // User clicked the OK button
    window.location.reload();
  } 
    // console.log();
    // window.location.reload();
  }
  return (
    <div>
      <AdminNav />
      {/* search bar */}
      {/* <p>{selectedCadidate.party_url}</p> */}
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
   
      {/*contract-verification  */}

      {contractVerificationToogle ?<div className="contract-verification">
      
        <div className="contract-title">
          <div className="contract-heading">
            Enter Contract Address to Add {selectedCadidate}.
          </div>
          <span className="close" onClick={contractToogle}>
            &times;
          </span>
        </div>
       
        <form onSubmit={Accept} className="contract-input">
          <input type="text" placeholder="0x00000000000000000000" required onChange={UpdateContractOnchange}/>
          {error ? <p className="error">{error}</p> : <p className="success">{success}</p>}
          <input type="submit" id="contract-btn" value="Verify And Add"   />
        </form>
      </div>:
      

      !viewMore ? <div id="block" className="voter-candidates">

        {cadidate.length == 0 ? <h2>Candidate have not Registered yet !</h2> : cadidate.map((person, index) => <div key={index} className="candidate-card">
          <div className="card-img">
            <img
              id="can-logo-img"
              src={person.img_url}
              width={"150rem"}
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
          <div className="verifi">
            <button className="btn-reg-verifi" value={person.adhar_number} onClick={contractToogle}>Accept</button>
            <button className="btn-reg-verifi" value={person.adhar_number} onClick={Reject}>Reject</button>
          </div>
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
      </div>
      }
    </div>
  );
}

export default CandVerifi;
