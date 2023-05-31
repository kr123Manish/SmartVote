import {React,useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import api from "../components/api";
import "./admin.css";
import "../components/App.css";

function AdminLogin() {
    const Navigate = useNavigate();
    const [credentials, updateCredentials] = useState({
        id:"",
        password:"",
      });
    
    const [error,updateError] = useState();
    const keepchange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        
        updateCredentials((previousValue) => {
            return {
              ...previousValue,
              [name]: value
            };
          });
    }
    
    const GetLogin=async(e)=>{
        e.preventDefault();
        // console.log(credentials)
        let result = await api.getAdmin(credentials.id,credentials.password);
        result = JSON.parse(result);
        // console.log(result);
        if(result['status']===true){
            updateError("");
            const token = result['token'];
            // console.log(token);
            localStorage.setItem("Admin_authToken",token);
            // console.log(localStorage.getItem("Adhar_authToken"));
            // console.log("Successfully verified.");
            Navigate("/VotingTime");
        }else if(result['error']){
            updateError(result['error']);
           
        }
       
          
    }
    return (
        <div>
            <nav>
                <div className="logo">
                    <h1>Smart Vote</h1>
                </div>
                <Link to="/otp">
                    <div className="navlist">
                        <li>
                            <Link to="/">Back to home</Link>
                        </li>
                    </div>
                </Link>
            </nav>
            <section>
                <div className="login">
                    <h1 className="text-clr">Admin Login</h1>
                </div>
            </section>
            <div className="aadhar-login">
                <form onSubmit={GetLogin}>
                <p className="error">{error}</p>
                    <label htmlFor="name">Admin ID</label> <br />
                    <input
                        type="text"
                        name="id"
                        id="name"
                        placeholder="0xdBd75C555c61b947"
                        required
                        onChange={keepchange} 
                        value={credentials.id}
                    />
                    <br />
                    <label htmlFor="name">Password</label> <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="*************"
                        value={credentials.password} 
                        required 
                        onChange={keepchange}
                    />
                    <br />
                    <input type="submit" value="Submit" id="submit" />
                    <br />
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
