import React, { useEffect, useState } from "react";
import "./App.css";
import { json, Link } from "react-router-dom";
import api from "./api";
import { useNavigate } from "react-router-dom";
import DeleteImage from "./deleteImage";
export default function Dashboard() {


  const Navigate = useNavigate();
  const [people, updatePeople] = useState([]);
  const [searchData, setSearchData] = useState([]);


  useEffect(() => {
    verifyAuth();
    GetAll();
  }, []);

  const verifyAuth = async () => {
    let data = await api.verifyToken();
    const jsonData = await JSON.parse(data);
    if (!jsonData) {
      // console.log(jsonData['error']['name']);
      Navigate("/sessionExpire");
    };
  }
  const GetAll = async () => {
    let data = await api.getAll();
    // console.log(data);
    const jsonData = await JSON.parse(data);
    updatePeople(jsonData);
    setSearchData(jsonData);

  }

  const Filter = async (e) => {
    let filter = e.target.value;
    if (filter === "") {
      updatePeople(searchData);
    } else {
      let result = searchData.filter(item => item.adhar_number.toLowerCase().includes(filter.toLowerCase()) || item.name.toLowerCase().includes(filter.toLowerCase()));
      // console.log(result);
      updatePeople(result);
    }

  }

  const Delete = async (e) => {
    const adhar_number = e.target.value;
    const url = e.target.id;
    // console.log(url);
    await DeleteImage(url);
    // console.log(res)

    // let data = await api.deletePerson(adhar_number);
    await api.deletePerson(adhar_number);
    // // const jsonData =  JSON.parse(data);
    // // console.log(data);
    window.location.reload();

  }

  const Logout = () => {
    localStorage.removeItem("Adhar_authToken");
    Navigate("/");
  }
  return (
    <div>

      <nav>
        <div className="logo"><h1>Project Aadhaar</h1></div>
        <form action="#">
          <input type="text" name="search" id="search" placeholder="Search By Name and Adhar.." onChange={Filter} /> <span id="mag">🔍</span>
        </form>
        <div className="add">
          <div className="navlist add-new"><li><Link to="/register">Add new</Link></li></div>
          <div className="add-new"><li><Link to="/" onClick={Logout}>Log Out</Link></li></div>
        </div>
      </nav>
      {/* {people.map(person => <div>{person.name}</div>)} */}

      <div className="data">
        <div className="cards">



          {people.length === 0 ? <h1>No Result Found :(</h1> : people.map(person =>

            <div className="card" key={person.adhar_number}>
              <div><img src={person.image} alt="" className="circle" /></div>
              <div className="container">
                {/* <h3>Name</h3><p> {person.name}</p><br />
                <h3 >Aadhaar no </h3><p> {person.adhar_number}</p><br />
                <h3>Address </h3><p> {person.address}</p><br />
                <h3>Gender </h3><p> {person.gender}</p><br />
                <h3>Date of birth </h3><p> {person.date_of_birth}</p><br />
                <h3>Mobile no </h3><p> {person.mobile_number}</p><br /> */}
                <div className="container-data">
                  <p className="container-title">Name -</p><p>{person.name}</p>
                </div>
                <div className="container-data">
                  <p className="container-title">Aaddhar no -</p><p>{person.adhar_number}</p>
                </div>
                <div className="container-data">
                  <p className="container-title">Gender -</p> <p>{person.gender}</p>
                </div>
                <div className="container-data">
                  <p className="container-title">Date of birth -</p> <p>{person.date_of_birth}</p>
                </div>
                <div className="container-data">
                  <p className="container-title">Mobile no -</p> <p>{person.mobile_number}</p>
                </div>
                <div className="container-data">
                  <p className="container-title">Address -</p> <p>{person.address}</p>
                </div>
              </div>
              <div className="card-btn">
                <button className="crbt" value={person.adhar_number} id={person.image} onClick={Delete}>Delete</button>
              </div>
            </div>

          )}


        </div>
      </div>
    </div>
  );
}
