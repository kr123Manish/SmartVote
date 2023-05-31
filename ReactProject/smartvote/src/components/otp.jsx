import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Otp() {
  return (
    <div>
      <nav>
        <div className="logo">
          <h1>Smart Vote</h1>
        </div>
        <Link to="/">
          <div className="navlist">
            <li>
              <Link to="/">Back to home</Link>
            </li>
          </div>
        </Link>
      </nav>
      <section>
        <div className="login">
          <h1 className="text-clr">OTP</h1>
        </div>
      </section>
      <div className="aadhar-login">
        <form action="#">
          <label htmlFor="name">Enter OTP on your Registered Aadhaar no</label>{" "}
          <br />
          <input
            type="number"
            name="name"
            id="name"
            placeholder="___ ___ ___ ___ ___ ___ "
            required
          />
          <br />
          <input type="submit" value="Submit" id="submit" />
          <br />
        </form>
      </div>
    </div>
  );
}

export default Otp;
