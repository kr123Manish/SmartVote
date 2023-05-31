import React, { useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import "./App.css";
import Slid from "./Slid_nav";
import Result from "./result"


function Dashboard() {
    return (
        <div>
            <Slid />
            <Result />
        </div>);
}

export default Dashboard;