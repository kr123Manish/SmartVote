import { React, useEffect, useState } from "react";
import "./App.css";
import Slid from "./Slid_nav";
import { json, useNavigate } from "react-router-dom";
import api from "./api";
import DeleteImage  from "./deleteImage";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
import app  from "./firebase";
import { async } from "@firebase/util";
import { v4 as uuidv4 } from 'uuid';
const storage = getStorage(app);


function VoterCandidate() {
  const Navigate = useNavigate();
  const adhar = localStorage.getItem("user_adhar");
  const [cadidateData, updateCadidateData] = useState({ 'name': "", 'adhar_number': "" });
  const [error, updateError] = useState();
  const [success, updateSuccess] = useState();
  const [toogle, updateToogle] = useState(false);
  const [prog, SetProgress] = useState(0);
  const [imgUrl, SetImgUrl] = useState("");
  const [ImageFile, updateImageFile] = useState();
  const [ImageName, updateImageName] = useState();
  const [details, updateDetails] = useState({
    partyName: "",
    higherQualification: "",
    workInfo: "",
  });
  useEffect(() => {
    verifyAuth();
    getCadidateData();
    findCandidate();
  }, []);

  const verifyAuth = () => {
    if (!adhar) {
      // console.log(jsonData['error']['name']);
      Navigate("/sessionExpire");
    };
  }
  const getCadidateData = async () => {

    let data = await api.getVoterData(adhar);
    // console.log(data);
    const jsonData = await JSON.parse(data);
    // console.log(jsonData);
    updateCadidateData({
      'name': jsonData.name,
      'mobile_number': jsonData.mobile_number,
      'image': jsonData.image,
      'gender': jsonData.gender,
      'email_id': jsonData.email_id,
      'date_of_birth': jsonData.date_of_birth,
      'adhar_number': jsonData.adhar_number,
      'address': jsonData.address
    });

  }
  
  const findCandidate = async() => {
    let data = await api.findCandidate(adhar);
    const jsonData = await JSON.parse(data);
    // console.log(jsonData);
    if(jsonData!==false){
      // console.log(jsonData['success']);
      updateDetails({
        partyName: jsonData['success']['group'],
        higherQualification:jsonData['success']['higherQualifications'],
        workInfo: jsonData['success']['workInfo'],
      });
      SetImgUrl(jsonData['success']['party_url']);
      updateSuccess("Your request already submitted.");
    }else{
      updateError("You have not registered yet.")
    }
    
  }


  const keepchange = (e) => {
    const name = e.target.name;
    // console.log(name)
    const value = e.target.value;
    // console.log(value)
    updateError("");
    updateDetails((previousValue) => {
      return {
        ...previousValue,
        [name]: value
      };
    });
    // console.log(details)
  }

  const addCadidate = async () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (details['partyName'] === "" ||
      details['higherQualification'] === "" ||
      details['workInfo'] === "" || imgUrl === "") {
      updateError("Fill the remaining fields.");
    } else {
      updateError("");
      updateSuccess("Ready to update");
      const data = await api.addCadidate(adhar, details['partyName'], details['higherQualification'], details['workInfo'], imgUrl);
      const jsonData = await JSON.parse(data);

      if (jsonData['error']) {
        updateSuccess("");
        updateError(jsonData['error']);
      } else {
        updateError("");
        updateSuccess("Your request added successfully.");
      }
    }
  }

  const toggleImagePage = () => {
    if(imgUrl){
      
      SetProgress(0);

    }
    if (toogle) {
      updateToogle(false);
    } else {
      updateToogle(true)
    }
  }

  const imageAdded = (e)=>{
    
    let file = e.target.files[0];
    // console.log(file);
    updateImageFile(file);
    updateImageName(adhar);
    // --------------------------------------------
  }
  const uploadFile = (e) => {
    e.preventDefault();

    if(imgUrl){
      SetImgUrl("");
      SetProgress(0);
      DeleteImage(imgUrl);
    }
    
    if (!ImageFile) return;
    // console.log(ImageFile) ;
    const imageName = uuidv4() + ImageName;
    const storageRef = ref(storage, `CandidateImages/${imageName}`);
    const uploadTask = uploadBytesResumable(storageRef, ImageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        SetProgress(progress);
        // console.log(prog);
      },
      (err) => {
        alert(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          SetImgUrl(downloadURL);
        });
      }
    );
  }
  return (
    !toogle ? <div>
      <Slid />
      <div className="candidate-register">
        {error ? <p className="error">{error}</p> : <p className="success">{success}</p>}
        <div className="voter-resiter-data">
          <div className="voter-top">
            <div className="vote-img">
              <img
                src={cadidateData.image}
                alt="img"
                id="voter-img"
                width={"200rem"}
                height={"200rem"}
              />
            </div>
            <div className="data-input">
              <div className="input-data">
                <span className="in-text">Name - {cadidateData.name}</span>
              </div>
              <div className="input-data">
                <span className="in-text">Aadhaar - {cadidateData.adhar_number}</span>
              </div>
              <div className="input-data">
                <span className="in-text">Email - {cadidateData.email_id}</span>
              </div>
            </div>
            {/* small inputs */}
          </div>
          <div className="small-inputs pad-bott">
            <div className="i-input">
              <div className="small-gen-data">
                <span className="in-text">Gender - {cadidateData.gender}</span>
              </div>
            </div>
            <br />
            <div className="i-input">
              <div className="small-gen-data">
                <span className="in-text">Mobile no- {cadidateData.mobile_number}</span>
              </div>
            </div>
            <br />
            <div className="i-input">
              <div className="small-gen-data">
                <span className="in-text">Date of Birth - {cadidateData.date_of_birth}</span>
              </div>
            </div>
          </div>
          <div className="address">
            <div className="i-input">
              <div className="input-data">
                <span className="in-text">Address - {cadidateData.address}</span>
              </div>
            </div>
          </div>
          {/* line */}
          <div className="line"></div>
          {/* upload data */}
          <div className="candidate">

            <div className="cadidate-img-up">
              {
              imgUrl?<img
              src={imgUrl}
              alt="img"
              id="can-logo-img"
              width={"100rem"}
              height={"100rem"}
            />:null}

              {success?null:<button className="Upload" onClick={toggleImagePage}>Upload logo</button>}
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
                    value={details.partyName}
                    onChange={keepchange}
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
                    value={details.higherQualification}
                    onChange={keepchange}
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
                value={details.workInfo}
                onChange={keepchange}
                required
              />
            </form>
          </div>
        </div>
        {success?null:<input type="submit" value="Register" id="submit" onClick={addCadidate} />}
        
      </div>
    </div> : <center className="uploadContainer">
      <div className="upload">
        <form id="upload_form" onSubmit={uploadFile} >
          <h4 id="status">Upload Status : {prog}%</h4>
          <progress
            id="progressBar"
            value={prog}
            max={100}
            style={{ width: "100%" }}
          />
          <input type="file" name="image" id="file1" accept="image/*" onChange={imageAdded} />
          <br />
          <input type="submit" value="Upload" />
          <br />

          
          <p onClick={toggleImagePage}>Exit</p>
        </form>
      </div>
      <h5>Image-url: {imgUrl}</h5>
    </center>
  );
}

export default VoterCandidate;
