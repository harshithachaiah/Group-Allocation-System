import React from 'react'
import { useState, useEffect } from 'react'


export default function EditProfile({ }) {

    const [userData, setuserData] = useState('')
    const [firstName, setFirstName] = useState('')
    const [surName, setSurName] = useState('')

    const [department, setDepartment] = useState('')
    const [uniqueId, setUniqueUniId] = useState('');



    useEffect(() => {

        getUserDetails()



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
                setuserData(data.data);



                if (data.data === "token expired") {
                    alert("Token expired Login again")
                    window.localStorage.clear();
                    window.location.href = "/sign-in"
                }



            })

    }

    const saveProfile = (id, userType) => {
        console.log(id, userType, firstName, surName, department);
        if (window.confirm("Are you sure you want to save changes")) {
            if (userType === "Admin") {

                fetch("http://localhost:4000/admin/update-userDetails", {
                    method: "PATCH",
                    crossDomian: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({
                        id: id,
                        firstName: firstName,
                        surName: surName,

                    }),
                }).then((res) => res.json())
                    .then((data) => {
                        console.log(data.data);
                        alert(data.data);
                        window.location.href = "/user-details"



                    })
            }

            else if (userType === "Supervisor") {

                fetch("http://localhost:4000/supervisor/update-userDetails", {
                    method: "PATCH",
                    crossDomian: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({
                        id: id,
                        firstName: firstName,
                        surName: surName,

                        department: department
                    }),
                }).then((res) => res.json())
                    .then((data) => {
                        console.log(data.data);
                        alert(data.data);
                        window.location.href = "/user-details"



                    })
            }

            else if (userType === "Student") {


                fetch("http://localhost:4000/student/update-userDetails", {
                    method: "PATCH",
                    crossDomian: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({
                        id: id,
                        firstName: firstName,
                        surName: surName,

                        department: department
                    }),
                }).then((res) => res.json())
                    .then((data) => {
                        console.log(data.data);
                        alert(data.data);
                        window.location.href = "/user-details"



                    })
            }
        }
    }




    return (
        <div>
            <div className="container rounded bg-white mt-5">
                <div className="row">
                    <div className="col-md-4 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">{userData.userType === ("Admin") ? <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="Admin" className="rounded-circle p-1 bg-primary" width="90" /> : userData.userType === ("Supervisor") ? <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Supervisor" className="rounded-circle p-1 bg-primary" width="110" /> : <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Student" className="rounded-circle p-1 bg-primary" width="110" />}<span className="font-weight-bold">{userData.firstName} {userData.surName}</span><span className="text-black-50">{userData.email}</span></div>
                    </div>
                    <div className="col-md-8">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex flex-row align-items-center back"><i className="fa fa-long-arrow-left mr-1 mb-1"></i>
                                    <a href="/user-details" >Back to profile</a>
                                </div>
                                <h6 className="text-right">Edit Profile</h6>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6"> First Name<input type="text" className="form-control" placeholder={userData.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                                <div className="col-md-6">Surname<input type="text" className="form-control" value={surName} onChange={(e) => setSurName(e.target.value)} placeholder={userData.surName} /></div>
                            </div>
                            <div className="row mt-3">

                                {userData.userType === ("Supervisor") ? < div className="col-md-6">Department<input type="text" className="form-control" placeholder={userData.department} value={department} onChange={(e) => setDepartment(e.target.value)} /></div> : userData.userType === ("Student") ? < div className="col-md-6">Department<input type="text" className="form-control" placeholder={userData.department} value={department} onChange={(e) => setDepartment(e.target.value)} /></div> : null}
                                <div className="mt-5 text-right"><button onClick={() => saveProfile(userData._id, userData.userType)} className="btn btn-primary profile-button" type="button">Save Profile</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}
