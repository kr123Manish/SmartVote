import { React, useState, useEffect } from "react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import DeleteImage from "./deleteImage";
import { v4 as uuidv4 } from 'uuid';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
import app from "./firebase";
const storage = getStorage(app);


function Register() {
  const Navigate = useNavigate();
  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    let data = await api.verifyToken();
    const jsonData = await JSON.parse(data);
    if (!jsonData) {
      // console.log(jsonData['error']['name']);
      Navigate("/sessionExpire");
    };
  }

  const [error, updateError] = useState();
  const [toogle, updateToogle] = useState(false);
  const [ImageName, updateImageName] = useState();
  const [ImageFile, updateImageFile] = useState();


  const [prog, SetProgress] = useState(0);
  const [imgUrl, SetImgUrl] = useState("");

  const [details, updateDetails] = useState({
    aadhaar: "",
    name: "",
    mobile: "",
    address: "",
    image: "",
    email: "",
    dob: "",
    gender: "",
  });

  const keepchange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    updateError("");
    updateDetails((previousValue) => {
      return {
        ...previousValue,
        [name]: value
      };
    });
    // console.log(details)
  }

  const AddPerson = async (e) => {
    e.preventDefault();

    let result = await api.addNew(
      details.aadhaar,
      details.name,
      details.mobile,
      details.address,
      imgUrl,
      details.email,
      details.dob,
      details.gender,
    );
    result = JSON.parse(result);
    if (result === true) {
      updateError("true");
      SetImgUrl("");
      SetProgress(0);
      updateImageFile();
      updateImageName("");
      // Navigate("/dashbord")
    } else if (result['error']) {
      await DeleteImage(imgUrl);
      SetImgUrl("");
      SetProgress(0);
      updateImageFile();
      updateImageName("");
      updateError(result['error']);

    }






  }

  const toggleImagePage = () => {
    if (toogle) {
      updateToogle(false);
    } else {
      updateToogle(true)
    }
  }

  const ImgName = (e) => {
    let file = e.target.files[0];
    // console.log(file);
    updateImageFile(file);
    updateImageName(file['name']);
  }

  const UploadImage = (e) => {
    e.preventDefault();
    if (!ImageFile) return;
    // console.log(ImageFile) ;
    const ImageName = uuidv4() + ImageFile.name;
    const storageRef = ref(storage, `VoterImages/${ ImageName }`);
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

    <div>
      {/* ---------------------------------------------------- */}
      {!toogle ? <div className="pg2">
        <nav>
          <div className="logo"><h1>Project Aadhaar</h1></div>
          <a ><Link className="navlist" to="/dashbord">Back</Link></a>
        </nav>
        {error === "true" ? <p className="success">Successfully Added.</p> : <p className="error">{error}</p>}
        <div className="register">

          <form onSubmit={AddPerson}>
            <label htmlFor="Aadhaar">Aadhaar no</label> <br />
            <input type="text" name="aadhaar" value={details.aadhaar} id="name" placeholder="Your Aadhar Number." required onChange={keepchange} /><br />

            <label htmlFor="name">Name</label> <br />
            <input type="text" name="name" value={details.name} id="name" placeholder="Your Name." required onChange={keepchange} /><br />

            <label htmlFor="name">Mobile</label> <br />
            <input type="text" name="mobile" id="name" value={details.mobile} placeholder="Your Mobile." required onChange={keepchange} /><br />

            <label htmlFor="name">Address</label> <br />
            <input type="text" name="address" id="name" value={details.address} placeholder="Your Address." required onChange={keepchange} /><br />

            <label htmlFor="name">Image</label> <br />
            <span onClick={toggleImagePage}><input type="text" name="image" id="name" value={imgUrl} placeholder="Click to Browse." required />
            </span>
            <br />


            <label htmlFor="name">Email</label> <br />
            <input type="email" name="email" id="name" value={details.email} placeholder="Example@gmail.com" required onChange={keepchange} /><br />

            <div className="twopart">
              <label htmlFor="name">Date of birth</label> <br />
              <input type="date" name="dob" id="date" value={details.dob} required onChange={keepchange} /><br />

              <label htmlFor="name">Gender</label> <br />
              <select id="Gender" name="gender" value={details.gender} required onChange={keepchange}>
                <option value="">Please select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Other</option>
              </select>
            </div><br></br>

            <input type="submit" id="submit" placeholder="Submit" /><br />

          </form>
        </div>
      </div> : <div className="maincontent">

        <div className="file-upload-wrapper">
          <div className="file-upload-wrapper-title">
            {prog > 0 ? <h3 style={{ 'color': 'green' }}>{prog} % Uploaded.</h3> : <p className="error">Not Uploaded Yet.</p>}


          </div>
          <form className="box-fileupload" onSubmit={UploadImage}>
            <input
              type="file"
              id="fileId"
              className="file-upload-input"
              name="files"
              accept="image/*"
              onChange={ImgName}
            />

            <label htmlFor="fileId" className="file-upload-btn" />
            <h4 className="box-fileupload_h3">{ImageName}</h4>
            <p className="box-fileupload__lable">Drop files here to upload</p>
            <button className="file-upload-wrapper-title__btn">Upload Now</button>
          </form>

          <div className="error-wrapper" />
          <button className="file-upload-wrapper-title__btn" onClick={toggleImagePage}>Exit</button>
          <div className="image-previwe" />
        </div>
      </div>}

      {/* -------------------------------------------------------------- */}

    </div>
  );
}

export default Register;