import React from 'react';
import Home from './home';
import Login from './Login';
import Error from './sessionExpire';
import Otp from './otp';
import Slid from './Slid_nav'
import Userinfo from './User_information';
import Register from './Voter_register';
import Candidate from './Voter_candidate';
import Vote from './vote';
import Dashboard from './Dashboard'; 
import AdminNav from '../Admin/admin_nav';
import AdminLogin from '../Admin/Admin_login';
import AdUserInfo from '../Admin/Ad_user_info';
import VotingTime from '../Admin/voting_time';
import CandiVerifi from '../Admin/candidate_verification';
import AdResult from "../Admin/Ad_result";
import '../Admin/admin.css';
import './App.css';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/otp" element={<Otp />} />
      <Route path="/slid" element={<Slid />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/userinfo" element={<Userinfo/>} />
      <Route path="/candidate" element={<Candidate />} />
      <Route path="/vote" element={< Vote/>} />
      <Route path="/dashboard" element={< Dashboard />} />
      <Route path="/AdminNav" element={<AdminNav/>} />
      <Route path="/AdminLogin" element={<AdminLogin/>} />
      <Route path="/VotingTime" element={<VotingTime/>} />
      <Route path="/AdUserInfo" element={<AdUserInfo/>} />
      <Route path="/CandiVerification" element={<CandiVerifi/>} />
      <Route path="/AdResult" element={< AdResult/>} />
      <Route path="/sessionExpire" element={<Error />} />
    </Routes>
    
  </Router>
    // <div>
    //   {/* <Home /> */}
    //   {/* <Login /> */}
    //   {/* <Otp /> */}
    //   {/* < Error/> */}
    //   {/* <Slid /> */}
    //   {/* <Userinfo/> */}
    //   {/* <Register/> */}
    // </div>
  );
}

export default App;