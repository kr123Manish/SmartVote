import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";


function Slide() {
  const Navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user_adhar");
    Navigate("/");
  }
  function openNav() {
    document.getElementById("mySidenav").style.width = "28rem";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  return (
    <div>
      <nav className="slid-nav">
        <div className="hamburger">
          <span
            style={{ fontSize: 50, cursor: "pointer", margin: "1rem" }}
            onClick={openNav}
          >
            &#9776;
          </span>
        </div>
        <div className="slide-logo">
          <Link to="/"><h1>Smart Vote</h1></Link>
        </div>
        <Link to="/">
          <div className="slide-navlist">
            <li>
              <Link to="/" onClick={logout}>Log Out</Link>
            </li>
          </div>
        </Link>
      </nav>

      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <h2 className="pd-1 slid-title text-1">Smart Vote</h2>
        <Link to="/userinfo">Voting Information</Link>
        <Link to="/register">Register as Voter</Link>
        <Link to="/candidate">Register as Candidate</Link>
        <Link to="/vote">Give your vote</Link>
        <Link to="/dashboard">Result</Link>
      </div>
    </div>
  );
}

export default Slide;
