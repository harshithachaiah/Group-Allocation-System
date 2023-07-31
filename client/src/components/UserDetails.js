import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import AdminHomepage from './AdminHomepage'
import StudentHomepage from './StudentHomepage'
import SupervisorHomepage from './SupervisorHomepage'

const UserDetails = () => {

    const [userData, setuserData] = useState('')
    const [superviser, setSupervisor] = useState("")
    const [admin, setAdmin] = useState('')


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
                if (data.data.userType === "Supervisor") {
                    setSupervisor("Supervisor")
                }
                else if (data.data.userType === "Admin") {
                    setAdmin("Admin")
                }
                setuserData(data.data);
                if (data.data === "token expired") {
                    alert("Token expired Login again")
                    window.localStorage.clear();
                    window.location.href = "/sign-in"
                }



            })




    }, [])





    return (

        admin === "Admin" ? <AdminHomepage userData={userData} /> : superviser === "Supervisor" ? <SupervisorHomepage userData={userData} /> : <StudentHomepage userData={userData} />

    )
}

export default UserDetails
