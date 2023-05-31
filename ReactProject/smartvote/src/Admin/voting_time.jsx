import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNav from "./admin_nav";
import "./admin.css";
import "../components/App.css";
import api from "../components/api";

function VoteTime() {

    const[Timing,updateTimings]=useState({
        'Reg_starting_time':"",
    });
    const [error, updateError] = useState();
    const [success, updateSuccess] = useState();
    const [newTime,updateNewTime]=useState({
        'reg_end_time':"",
        'reg_end_date':"",
        'voting_end_date':"",
        'voting_end_time':"",
        'contract_address':"",
    });

    useEffect(()=>{
        getTime();
    },[]);

    const getTime = async()=>{
        let data = await api.getTime();
        const jsonData = await JSON.parse(data);
        // console.log(jsonData['StartTime']);

        let Reg_starting_time = jsonData['StartTime'];
        Reg_starting_time = api.convertTime(Reg_starting_time);

        let Registration_endTime = jsonData['Registration_endTime'];
        Registration_endTime = api.convertTime(Registration_endTime);
        // console.log(Registration_endTime);
        
        let Voting_EndTime = jsonData['Voting_EndTime'];
        Voting_EndTime = api.convertTime(Voting_EndTime);
        
        updateTimings({
            'Reg_starting_time': Reg_starting_time,
            'Registration_endTime': Registration_endTime,
            'Voting_EndTime':Voting_EndTime,

        })
    }

    const keepChange = (e)=>{
        const value = e.target.value;
        const name = e.target.name;
        updateNewTime((previousValue) => {
            return {
              ...previousValue,
              [name]: value
            };
          });
    }

    const setTime = async()=>{
        if(newTime.reg_end_time===""||newTime.reg_end_date===""
        ||newTime.voting_end_time===""||newTime.voting_end_date===""){
            updateError("Set Registration and Voting Timing is mandatory.")
        }
        else if(newTime.contract_address===""){
            updateError("Enter Contract Address.");
        }
        else{
            updateError("");
            let data = await api.setTime(newTime.reg_end_time,newTime.reg_end_date,newTime.voting_end_time,
                newTime.voting_end_date,newTime.contract_address);

            // console.log(data);
            if(data==="Timings have been set successfully."){
                updateError("");
                updateSuccess(data);
            }else{
                updateSuccess("");
                updateError(data);
            }
        }
        
    }
    return (
        <div>
            <AdminNav />
            <div className="voting-time">
                <div className="voting-title"><h1>Voting time setup</h1></div>
                <div className="blue-line"></div>
                {error?<p className="error">{error}</p>:<p className="success">{success}</p>}
                <div className="setting">
                
                    <div className="registration-end-time">
                    
                        <div className="reg-title"><h2>Registration End Time</h2></div>
                        <div className="time">
                            <div className="time-lable">Select  Time</div>
                            {/* step="0.001" */}
                            <input type="time"  name="reg_end_time" id="reg-time" onChange={keepChange}/>
                        </div>
                        <div className="date">
                            <div className="date-lable">Select  Date</div>
                            <input type="date" name="reg_end_date" id="reg-date" onChange={keepChange} />
                        </div>
                    </div>
                    <div className="blue-line-vertical"></div>
                    <div className="voting-end-time">
                        <div className="voting-title"><h2>Voting End Time</h2></div>
                        <div className="time">
                            <div className="time-lable">Select  Time</div>
                            <input type="time" name="voting_end_time" id="reg-time" onChange={keepChange} />
                        </div>
                        <div className="date">
                            <div className="date-lable">Select  Date</div>
                            <input type="date" name="voting_end_date" id="reg-date" onChange={keepChange} />
                        </div>
                    </div>
                </div>
                <p>Contract Address</p>
                <input type="text" placeholder="Enter Contract Address." id="contract_address" name="contract_address" onChange={keepChange}/>
                <input type="submit" value="Set time" onClick={setTime} />
                <div className="blue-line"></div>
            </div>

            <div className="previous-time-record">
                <div className="previous-title"><h1>Previous time changes</h1></div>
                <div className="blue-line"></div>
                <div className="previous-data-tile">
                    <div className="text-data">Registration End time</div>
                    {/* <div className="pre-date-data">Date - 23/03/23</div> */}
                </div>
                <div className="pre-time-data">
                    <div className="pre-time-data-1">
                        <div className="start-time-title">Start time</div>
                        <div className="end-time-title">End time</div>
                    </div>
                    <div className="pre-time-data-1">
                        <div className="start-time">{Timing.Reg_starting_time}</div>
                        <div className="end-time">{Timing.Registration_endTime}</div>
                    </div>
                </div>
                <div className="blue-line"></div>
                <div className="previous-data-tile">
                    <div className="text-data">Voting  End time</div>
                    {/* <div className="pre-date-data">Date - 23/03/23</div> */}
                </div>
                <div className="pre-time-data">
                    <div className="pre-time-data-1">
                        <div className="start-time-title">Start time</div>
                        <div className="end-time-title">End time</div>
                    </div>
                    <div className="pre-time-data-1">
                        <div className="start-time">{Timing.Registration_endTime}</div>
                        <div className="end-time">{Timing.Voting_EndTime}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VoteTime;
