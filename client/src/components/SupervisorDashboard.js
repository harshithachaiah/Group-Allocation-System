import React from 'react'
import { useEffect, useState } from 'react'
import SupervisorSidebar from './SupervisorSidebar';

const SupervisorDashboard = () => {
    const [userData, setuserData] = useState({})
    const [data, setData] = useState([])
    const [user, setUser] = useState('')

    useEffect(() => {


        getUserDetails();


        fetch(`http://localhost:4000/supervisor/getdashboard-details`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.data)

            })



    }, [])


    function getUserDetails() {
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
                setUser(data.userType);
                setuserData(data.data);



                if (data.data === "token expired") {
                    alert("Token expired Login again")
                    window.localStorage.clear();
                    window.location.href = "/sign-in"
                }



            })

    }

    function getUserNotification() {



    }

    if (data.length === 0) {
        return (

            < div className='app' >
                <div className="col-2 p-0">
                    <SupervisorSidebar />
                </div>
                <div className="col-9 m-5">
                    <h4>Welcome to Personal and Group Skills module (CO7210) Group allocation System.</h4>
                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Notification</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Application usage</h6>
                            <p className="card-text">The web application is designed to facilitate the allocation of students to supervisors and topics for the Personal and Group Skills module (CO7210) </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    return (

        < div className='app' >
            <div className="col-2 p-0">
                <SupervisorSidebar />
            </div>
            <div className="col-9 m-5">
                <h4>Welcome to Personal and Group Skills module (CO7210) Group allocation System.</h4>
                <div className="card" >
                    <div className="card-body">
                        <h5 className="card-title">Notification</h5>


                        <table className="table table-striped table-hover allborder">
                            <tbody>
                                {data.map(m => (
                                    <tr key={m._id}>
                                        <td><h6 className="card-subtitle mb-2 text-muted">{m.subject}</h6></td>
                                        <td>{m.announcement}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>
                </div>
            </div>

        </div>
    )





}



export default SupervisorDashboard
