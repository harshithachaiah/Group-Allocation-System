import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import SupervisorSidebar from './SupervisorSidebar';
import Sidebar from './Sidebar';

import { useState } from 'react';


const AdminAddTopic = () => {

    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");

    const [userData, setuserData] = useState('')
    const [randomNumber, setRandomNumber] = useState(null);



    useEffect(() => {

        fetch("http://localhost:4000/user/data", {
            method: "POST",
            crossDomian: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "User Data");

                setuserData(data.data);
                if (data.data === "token expired") {
                    alert("Token expired Login again")
                    window.localStorage.clear();
                    window.location.href = "/sign-in"
                }



            })

    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(topic, description, userData.email, userData.firstName + " " + userData.surName, code);
        fetch("http://localhost:4000/admin/test", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                name: userData.firstName + " " + userData.surName,
                title: topic,
                description: description,
                email: userData.email,
                code: code
            }),
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "Subject updated") {
                    console.log(data, "Subject Uploaded");
                    alert("Subject updated")
                    setTopic("");
                    setDescription("");
                    setCode("");

                }
                else if (data.error === "Code Exists") {
                    alert("Code Exists try new code")

                }

            })



            .catch((err) => {
                console.error(err);
            });
    };


    const generateRandomNumber = () => {
        const min = 1000; // minimum value for 4-digit number
        const max = 9999; // maximum value for 4-digit number
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        setRandomNumber("CO" + randomNumber);
    };


    return (
        <div className='app' >
            <div className="col-2 p-0">

                <Sidebar />
            </div>
            <div className="col-8 p-0 m-3">
                <form className='justify-content-center' onSubmit={handleSubmit}   >

                    <div className="form-floating mb-3">
                        <textarea required value={topic} onChange={(e) => setTopic(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Enter the topic"></textarea>
                        <label >Topic title</label>
                    </div>

                    <div className="form-floating">
                        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Description"></textarea>
                        <label >Description</label>
                    </div>

                    <div className="form-floating mt-3">
                        <input required value={code} onChange={(e) => setCode(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Code"></input>
                        <label >Topic Code</label>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Upload Topic</button>
                </form >
                <button className="btn btn-primary mt-3" onClick={generateRandomNumber}>Generate Code</button>
                {randomNumber && <p>Random Number: {randomNumber}</p>}



            </div >
        </div >
    )
}

export default AdminAddTopic
