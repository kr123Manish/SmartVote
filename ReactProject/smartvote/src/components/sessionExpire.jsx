import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Error() {
  return (
    <div className="errorbody">
      <div className="text">
        <div>ERROR</div>
        <h1>404</h1>
        <hr />
        <div>Page Not Found</div>
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
    </div>
  );
}

export default Error;
