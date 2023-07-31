import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';



import { useState } from 'react';
import StudentSidebar from './StudentSidebar';


const StudentSuggestTopic = () => {

    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");

    const [userData, setuserData] = useState('')



    const [supervisoraddtopic, setsupervisoraddtopic] = useState(false)




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
        getTimeline();


    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(topic, description, userData.email, userData.firstName + " " + userData.surName);
        fetch("http://localhost:4000/student//suggest-topic", {
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

            }),
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "Topic updated") {
                    console.log(data, "Topic Uploaded");
                    alert("Topic suggested")
                    setTopic("");
                    setDescription("");

                }


            })



            .catch((err) => {
                console.error(err);
            });
    };



    function getTimeline() {
        fetch("http://localhost:4000/admin/gettimeline", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Timeline");
                setsupervisoraddtopic(data.data.supervisoraddtopic)


            })

    }

    if (!supervisoraddtopic) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <StudentSidebar />
                </div>


                <div className="col-7 m-5">

                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Notification</h5>
                            <h6 className="card-subtitle mb-2 text-muted">This Page is currently unavailable</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }


    return (
        <div className='app' >
            <div className="col-2 p-0">

                <StudentSidebar />
            </div>
            <div className="col-8 p-0 m-3">
                <form className='justify-content-center' onSubmit={handleSubmit}   >

                    <div className="form-floating mb-3">
                        <textarea required value={topic} onChange={(e) => setTopic(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Enter the topic"></textarea>
                        <label >Topic title</label>
                    </div>

                    <div className="form-floating">
                        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Description"></textarea>
                        <label htmlFor="floatingPassword">Description</label>
                    </div>


                    <button type="submit" className="btn btn-primary mt-2">Suggest Topic</button>
                </form >


            </div>

        </div >
    )
}

export default StudentSuggestTopic
