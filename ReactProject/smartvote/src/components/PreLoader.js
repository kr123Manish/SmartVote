import React from "react";
import "./preloader.css"
const PreLoader=()=>{
    return <div className="preloader">
    <img src={require("../images/preloader.gif")}/>
    <h1><i>Loading ...</i></h1>
    </div>
}

export default PreLoader;