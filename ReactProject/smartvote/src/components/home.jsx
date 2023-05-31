import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
// let logo = require('../images/main-img.svg');

function Home() {
  return (
    <div>
      <nav>
        <div className="logo">
          <h1>Smart Vote</h1>
        </div>
        <Link to="/login">
          <div className="navlist">
            <li>
              <Link to="/AdminLogin">Admin Login</Link>
            </li>
          </div>
        </Link>
      </nav>
      <section>
        <div className="main">
          <div className="main-text">
            <h2 className="text-1">Smart Vote</h2>
            <p className="text-clr ">
              E - Voting System <br />
              made using Web 3 <br />
              and Blockchain
            </p>
            {/* <Link className="btn-reg" to="/login" >Resigter</Link> */}
            <div className="home-btn">
              <Link className="btn-reg" to="/login" >Resigter For Vote</Link>
              <Link className="btn-reg" to="http://localhost:3005/" >Add New Aadhaar</Link>
            </div>
          </div>
          <img
            src={require("../images/b.png")}
            className="main-img"
            alt="main-img"
          />
        </div>
      </section>
      <section>
        <div className="info">
          <div className="info-text">
            <h2 className="text-1">
              {" "}
              <span className="text-clr st-1 ">About</span> Smart Vote
            </h2>
            <p className="st-1 ">
              A smart E-voting system made using blockchain technology and{" "}
              <br />
              modern web 3 implementation for a e-voting system, makes voting{" "}
              <br />
              highly secured and trustable for voters and Electoral system, can{" "}
              <br />
              be used in any voting type form schools to big corporates andbr{" "}
              <br />
              governments too.
            </p>
            <div className="features pd-1 st-1 ">
              <li>Fast</li>
              <li>secured</li>
              <li>Easy to manage</li>
              <li>Modern</li>
              <li>Stats</li>
              <li>web 3 & blockchain</li>
            </div>
          </div>
          <img
            src={require("../images/info.png")}
            className="info-img"
            alt="info-img"
          />
        </div>
      </section>
      <section>
        <div className="head">
          <div className="head-text">
            <h2 className="text-1">
              Our <span className="text-clr">Features</span>
            </h2>
            <div className="text-2 st-1">Custom Voting System</div>
            <p>As Custom features for voting</p>
            <div className="text-2 st-1">Custom Voting System</div>
            <p>As Custom features for voting</p>
          </div>
          <div className="head-text">
            <h2 className="text-1">
              <span className="text-clr">Web 3</span> Implementation
            </h2>
            <div className="text-2 st-1">Custom Voting System</div>
            <p>As Custom features for voting</p>
            <div className="text-2 st-1">Custom Voting System</div>
            <p>As Custom features for voting</p>
          </div>
        </div>
      </section>
      <section>
        <div className="services-main">
          <h1 className="text-2 pd-1">
            Our <span className="text-clr-1">services</span>{" "}
          </h1>
          <div className="services">
            <div className="rect-1"></div>
            <div className="service-1">
              <h3 className="text-3 st-1">What we can do</h3>
              <p>
                We believe that a great design should be intuitive and
                user-friendly for everyone, including those who don't
                understand. It's our job to ensure that your audience can
                interact with voting in a way that makes sense for them, whether
                they're on a laptop or a phone.
              </p>
            </div>
            <div className="rect-2"></div>
            <div className="service-2">
              <h3 className="text-3 st-1">Voting with Blockchain</h3>
              <p>
                Creating Voting with Blockchain technology for Voting system to
                make them more secure. Developing interactive elements like
                websites & mobile apps . Creating statistical data
                representations that get results.
              </p>
            </div>
            <div className="rect-3"></div>
            <div className="service-3">
              <h3 className="text-3 st-1">Most Secured Voting</h3>
              <p>
                It's one the modern and secured Voting system which can be
                trusted using blockchain and strong verification system for
                voters and electors in the new Web 3 technology.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="lower-main">
          <h2 className="text-1 text-clr">
            Let's Make Our
            <br /> Vote Count
          </h2>
          <div className="btn">
            <Link to="https://www.linkedin.com/in/manish-kumar-patel-980651219/" className="btn-1">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className="footer">&#169; Smart Vote reserved 2023-24</div>
      </section>
    </div>
  );
}

export default Home;
