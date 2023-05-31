import React, { useState }from "react";
import "./App.css";
import api from "./api";
import { Link,useNavigate } from "react-router-dom";


export default function SessionExpire(){
    return (<div className="errorbody">
    <div className="text">
      <div>ERROR</div><br></br>
      <h1>404</h1>
      <hr />
      <br></br>
      <div>Session Expired Please login again.</div>
      <div className="navlist er-btn">
        <li>
          <Link to="/login">Back</Link>
        </li>
      </div>
    </div>
    <div className="astronaut">
      <img
        src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
        alt=""
        className="src"
      />
    </div>
  </div>);
}