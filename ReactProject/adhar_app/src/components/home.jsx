import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <nav>
                <div className="logo"><h1><Link to="/"> Project Aadhaar</Link></h1></div>
                <div><Link className="navlist" to="/login">Login</Link></div>
            </nav>
            <section>
                <div className="main">
                    <img src={require("../images/a.png")} alt="main-img" />
                    <h2 className="text-1">The Web 3 Aadhaar solution</h2>
                    <p className="text-clr">Create using Blockchain <br />Technology</p>
                </div>
            </section>
            <section>
                <div className="services-main">
                    <h1 className="text-2 pd-1">Our <span className="text-clr-1">services</span> </h1>
                    <div className="services">
                        <div className="rect-1"></div>
                        <div className="service-1">
                            <h3 className="text-3 st-1">What we can do</h3>
                            <p>We believe that a great design should be intuitive and user-friendly for everyone, including those who don't understand. It's our job to ensure that your audience can interact with voting in a way that makes sense for them, whether they're on a laptop or a phone.</p>
                        </div>
                        <div className="rect-2"></div>
                        <div className="service-2">
                            <h3 className="text-3 st-1">Voting with Blockchain</h3>
                            <p>Creating Voting with Blockchain technology for Voting system to make them more secure. Developing interactive elements like websites & mobile apps . Creating statistical data representations that get results.</p>
                        </div>
                        <div className="rect-3"></div>
                        <div className="service-3">
                            <h3 className="text-3 st-1">Most Secured Voting</h3>
                            <p>It's one the modern and secured Voting system which can be trusted using blockchain and strong verification system for voters and electors in the new Web 3 technology.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="lower-main">
                    <h2 className="text-1 text-clr">The Modern Voting System is <br /> Smart Vote </h2>
                    <div className="btn"><a className="btn-1" href="http://localhost:3050/">Visit</a></div>
                </div>
            </section>
            <section>
                <div className="footer text-clr"> &#169; Project Aadhaar reserved 2023-24</div>
            </section>
        </div>
    );
}

export default Home;