import React from 'react';
import Home from './home';
import Login from './login';
import Register from './register';
import Dashboard from './dashbord';
import SessionExpire from './sessionExpire';
import './App.css';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashbord" element={<Dashboard />} />
      <Route path="/sessionExpire" element={<SessionExpire />} />
    </Routes>
    
  </Router>
  );
}

export default App;