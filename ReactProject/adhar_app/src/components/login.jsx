import React, { useState } from "react";
import "./App.css";
import api from "./api";
import { Link, useNavigate } from "react-router-dom";



export default function Login() {
    const Navigate = useNavigate();
    const [credentials, updateCredentials] = useState({
        id: "",
        password: "",
    });

    const [error, updateError] = useState();
    const keepchange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        updateCredentials((previousValue) => {
            return {
                ...previousValue,
                [name]: value
            };
        });
    }

    const GetLogin = async (e) => {
        e.preventDefault();
        // console.log(credentials)
        let result = await api.getAdmin(credentials.id, credentials.password);
        result = JSON.parse(result);
        // console.log(result);
        if (result['status'] === true) {
            updateError("");
            const token = result['token'];
            // console.log(token);
            localStorage.setItem("Adhar_authToken", token);
            // console.log(localStorage.getItem("Adhar_authToken"));
            // console.log("Successfully verified.");
            Navigate("/dashbord");
        } else if (result['error']) {
            updateError(result['error']);

        }


    }

    return (

        <div>
            <nav>
                <div className="logo"> <h1><Link to="/"> Project Aadhaar</Link></h1></div>
                <div ><Link className="navlist" to="/">Home</Link></div>
            </nav>
            <div className="admin-login">

                <form onSubmit={GetLogin}>
                    <p className="error">{error}</p>
                    <label htmlFor="name">Unique Id </label> <br />
                    <input type="text" name="id" id="name" placeholder="0xdBd75C555c61b947" required onChange={keepchange} value={credentials.id} />

                    <div></div><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" name="password" id="password" placeholder="**********" value={credentials.password} required onChange={keepchange} /><br />
                    <div></div>
                    <input type="submit" value="Submit" id="submit" /><br />
                </form>
            </div>
        </div>
    );
};