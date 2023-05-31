import React from "react";
import "./admin.css";
import "../components/App.css";
import AdminNav from "./admin_nav";

function AdUserInfo() {
    return (
        <div>
            <AdminNav />
            <div className="user-maual">
                <div className="heading">
                    <h2>User manual</h2>
                </div>
                <div className="user-title">
                    <h2>Welcome, to SmartVote</h2> <br />
                    <h3>These are Guidelines for user:</h3>
                </div>
                <div className="manual-data">
                    <h2>1.Voter Registration</h2>
                    <ul>
                        <li>
                            First go to “ Register as Voter “ then, cross check your account
                            with your user information.
                        </li>
                        <li>Now, type your secret code and verify it.</li>
                        <li>Then, click on the “Register” button to Register as voter.</li>
                    </ul>
                    {/* Voting process */}
                    <div className="space"></div>
                    <h2>2.Voting Process</h2>
                    <ul>
                        <li>
                            First go to “ Give your Vote “ then, you see different candidate’s
                            user information.
                        </li>
                        <li>
                            Now, choose your candidate and verify the “Party name” which you
                            want to vote also, click on “ view more “ to get more information
                            about the candidate.
                        </li>
                        <li>Then, click on the “vote” button to Vote your candidate.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdUserInfo;
