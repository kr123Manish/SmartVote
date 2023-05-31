import { React, useEffect, useState } from "react";
import "./App.css";
import Slid from "./Slid_nav";
import { useNavigate } from "react-router-dom";
import api from "./api";

function VoterRegisteration() {
  const Navigate = useNavigate();
  const adhar = localStorage.getItem("user_adhar");
  const [voterData, updateVoterData] = useState({ 'name': "", 'adhar_number': "" });
  const [error, updateError] = useState();
  const [success, updateSuccess] = useState();


  useEffect(() => {
    verifyAuth();
    getVoterData();
  }, []);

  const verifyAuth = () => {
    if (!adhar) {
      // console.log(adhar);
      Navigate("/sessionExpire");
    }
  }


  const getVoterData = async () => {

    let data = await api.getVoterData(adhar);
    // console.log(data);
    const jsonData = await JSON.parse(data);
    // console.log(jsonData);
    updateVoterData({
      'name': jsonData.name,
      'mobile_number': jsonData.mobile_number,
      'image': jsonData.image,
      'gender': jsonData.gender,
      'email_id': jsonData.email_id,
      'date_of_birth': jsonData.date_of_birth,
      'adhar_number': jsonData.adhar_number,
      'address': jsonData.address
    });
    let result = await api.voterStatus(localStorage.getItem("user_adhar"));
    result = JSON.parse(result);
    if(!result){
     updateError("You Have Not Registered.");
     updateSuccess("");
    }else if(result){
      updateSuccess("You Already Registered.");
      updateError("");
    }
  }

  const RegisterVoter = async () => {
    let data = await api.addVoter(voterData.adhar_number);
    if (data === "Voter added successfully.") {
      updateError("");
      updateSuccess("You have successfully registered for the voting.");
    } else {
      updateError(data);
      updateSuccess("");
    }

  }

  
  return (
    <div>
      <Slid />
      <div className="voter-register">
        <div className="voter-resiter-data">
          <div className="voter-top">
            <div className="vote-img">
              <img
                id="voter-img"
                src={voterData.image}
                alt="img"
                width={"200rem"}
                height={"200rem"}
              />
            </div>
          </div>
          {/* data */}
          <div className="data-input">
          {error?<p className="error">{error}</p>:<p className="success">{success}</p>}
            <div className="input-data">
              <span className="in-text">Name - {voterData.name}</span>
            </div>
            <div className="input-data">
              <span className="in-text">Aadhaar - {voterData.adhar_number}</span>
            </div>
            <div className="input-data">
              <span className="in-text">Mobile no - {voterData.mobile_number}</span>
            </div>
            <div className="input-data">
              <span className="in-text">Email - {voterData.email_id}</span>
            </div>
            {/* small inputs */}
            <div className="small-inputs">
              <div className="i-input">
                <div className="gender-data">
                  <span className="in-text">Gender - {voterData.gender}</span>
                </div>
              </div>
              <br />
              <div className="i-input">
                <div className="date-data">
                  <span className="in-text">Date of birth - {voterData.date_of_birth}</span>
                </div>
              </div>
            </div>
            <div className="input-data">
              <span className="in-text"> Address - {voterData.address}</span>
            </div>
          </div>
          <br />
        </div>
        {!success?<input type="submit" value="Register" id="submit" onClick={RegisterVoter} />:null}
      </div>
    </div >
  );
}

export default VoterRegisteration;
