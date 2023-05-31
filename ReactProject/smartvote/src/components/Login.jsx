import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import api from "./api";
// firebase  -------------------------------------
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

import app from "./firebase_Config";
const auth = getAuth(app);

// ------------------------------------------------
function Login() {
  const Navigate = useNavigate();

  const [error, updateError] = useState();
  const [adhar, updateAdharNo] = useState();
  const [otpStatus,updateOtpStatus] = useState(false);
  const [OTP,updateOtp] = useState();
  const [message,updateMessage] = useState("Please wait OTP is sending...");
  
  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = () => {
    if (localStorage.getItem("user_adhar")) {
      // console.log(adhar);
      Navigate("/register");
    }
  }

  const RecaptchaGenerator = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha_container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        }
      },
      auth
    );
  };

  const requestOtp = (mobile) => {
    const phoneNumber = "+91" + mobile;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        updateOtpStatus(true)
        updateMessage("Opt sended to registered mobile number ends with XXXXXXXX"+mobile.slice(-2));
        // console.log(mobile.slice(-2));
        // alert("OTP sent to Phone No.");
        // console.log(confirmationResult);
        // ...
      })
      .catch((error) => {
        alert("Invalid Phone NO.");
        console.log("Error : ", error);
      });
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const code = OTP;
    if (code.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(code)
        .then((result) => {
          // User signed in successfully.
          // const user = result.user;
          updateError("");
          alert("User Verfied");
          localStorage.setItem("user_adhar",adhar);
          Navigate("/register");
          // alertFunction();
          // ...
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
          console.log(error);
          // alert("not verified");
          updateError("Entered OTP is wrong.")
        });
    } else {
      // alert("6 digit OTP");
      updateError("Enter 6 digit OTP");
    }
  };

  // ---------------------------------------------------
  const onAdharChange = (e) => {
    const mob = e.target.value;
    updateAdharNo(mob);
  }
  const onOtpChange = (e) => {
    const otp = e.target.value;
    updateOtp(otp);
  }
  const getMobile = async (e) => {
    e.preventDefault();
    let data = await api.getMobile(adhar);
    // const jsonData = await JSON.parse(data);
    // console.log(data);
    if (data === "false") {
      updateError("Entered Adhar Number is wrong.")
    } else {
      updateError("");
      updateOtp("");

      updateOtpStatus(true);
      RecaptchaGenerator();
      // console.log(data)
      requestOtp(data);

    }

  }
  return (
    <div>
      <nav>
        <div className="logo">
          <h1>Smart Vote</h1>
        </div>
        <Link to="/">
          <div className="navlist">
            <li>
              <Link to="/">Home</Link>
            </li>
          </div>
        </Link>
      </nav>
      <section>
        <div className="login">
          <img
            src={require("../images/Shape.png")}
            alt="shape"
            height={"90rem"}
            className="pd-1"
          />
          <h1 className="text-clr">Login with Aadhar</h1>
        </div>
      </section>
      
      <div className="aadhar-login">
      
        {!otpStatus?<form onSubmit={getMobile}>
        <p className="error">{error}</p><br></br>
          <label htmlFor="name">Enter Aadhaar No </label> <br />
          <input
            type="number"
            name="name"
            id="name"
            placeholder="123456789101112"
            required
            value={adhar}
            onChange={onAdharChange}
          />
          <br />
          <input type="submit" value="Submit" id="submit" />
          <br />
        </form>:<form>
        <p className="error">{error}</p><br></br>
          <label htmlFor="name">Enter OTP on your Registered Aadhaar no</label>{" "}
          <br />
          <input
            type="number"
            name="name"
            id="name"
            placeholder="___ ___ ___ ___ ___ ___ "
            required
            value={OTP}
            onChange={onOtpChange}
          />
          <p><b>{message}</b></p>
          <br />
          <input type="submit" value="Submit" id="submit" onClick={verifyOtp} />
          <br />
        </form>
        }
        <div id="recaptcha_container"></div>
      </div>
    </div>
  );
}

export default Login;
