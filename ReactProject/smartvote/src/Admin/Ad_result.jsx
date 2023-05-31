import React from "react";
import { Link } from "react-router-dom";
import "../components/App.css";
import "./admin.css";
import AdminNav from "./admin_nav";
import Result from "../components/result";

function adminDashboard() {
    return (
        <div>
            <AdminNav />
            <Result/>
        </div>
    );
}

export default adminDashboard;
