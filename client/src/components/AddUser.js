import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react"
import "./SignUp.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Sidebar from './Sidebar';


const AddUser = () => {


    const [firstName, setfirstName] = useState('')
    const [surName, setsurName] = useState('')

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [userType, setUserType] = useState('')
    const [degreeType, setdegreeType] = useState('')
    const [department, setdepartment] = useState('')



    const handleSubmit = (e) => {


        if (userType === "Supervisor") {
            e.preventDefault();


            console.log(firstName, surName, email, department);
            fetch("http://localhost:4000/supervisor/registration", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({

                    firstName: firstName,
                    surName: surName,

                    email: email,
                    password: email,
                    department: department,
                    userType: userType

                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data, "Supervisor Registered");
                    if (data.status === "ok") {
                        alert("Supervisor Added")


                    }
                })


            setfirstName("")
            setsurName("")

            setemail("")
            setpassword("")
            setdepartment("")


        }





        if (userType === "Student") {
            e.preventDefault();


            console.log(firstName, surName, email, degreeType, department);
            fetch("http://localhost:4000/student/registration", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({

                    firstName: firstName,
                    surName: surName,

                    email: email,
                    password: email,
                    degreeType: degreeType,
                    department: department,
                    userType: userType

                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data, "Student Registered");
                    if (data.status === "ok") {
                        alert("Student Added")


                    }
                })


            setfirstName("")
            setsurName("")

            setemail("")
            setpassword("")
            setdegreeType("")
            setdepartment("")


        }
    }
    return (
        <div className=' app'>
            <div className="col-2 p-0">
                <Sidebar />
            </div>
            <div className='col-10 p-0 card body'>
                <form onSubmit={handleSubmit} >
                    <div className='card-center '>
                        <div className='card m-5 p-4 '>

                            Create User as
                            <div>
                                <input
                                    type="radio"

                                    className='m-2'
                                    name="UserType"
                                    value="Student"
                                    onChange={(e) => setUserType(e.target.value)}
                                />{" "}
                                Student
                                <input
                                    className='m-2'
                                    type="radio"

                                    name="UserType"
                                    value="Supervisor"
                                    onChange={(e) => setUserType(e.target.value)}
                                />{" "}
                                Supervisor
                            </div>
                            {/* {userType === "Supervisor" ? <div className="mb-3">
                            <label>Secret Key</label>
                            <input
                                type="text"

                                className="form-control"
                                placeholder="Secret Key"
                                value={secretKey}
                                onChange={(e) => setsecretKey(e.target.value)}
                            />
                        </div> : null} */}

                            {/* <div >
                    <label htmlFor="title">Title</label>

                    <select required onChange={(e) => settitle(e.target.value)} className='form-control form-group'>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        {userType == "Supervisor" ? <option value="Dr.">Dr.</option> : null}
                    </select>
                </div> */}


                            <div >
                                <label>First Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="First name"
                                    className="form-control"
                                    value={firstName}
                                    onChange={(e) => setfirstName(e.target.value)}
                                />
                            </div>

                            <div >
                                <label>SurName</label>
                                <input
                                    type="text"
                                    placeholder="Surname"
                                    className="form-control"
                                    value={surName}
                                    onChange={(e) => setsurName(e.target.value)}
                                />
                            </div>


                            <div className="mb-3">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                />
                            </div>



                            {userType === "Student" ? <div className="mb-3">
                                <label htmlFor="degree">Degree Type</label>

                                <select required onChange={(e) => setdegreeType(e.target.value)} className='form-control form-group'>
                                    <option value="Post Graduate diploma">Post Graduate diploma</option>
                                    <option value="Post Graduate distance">Post Graduate distance</option>
                                    <option value="Post Graduate taught">Post Graduate taught</option>
                                </select>
                            </div> : null}

                            <div >
                                <label>Department</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Department of school"
                                    value={department}
                                    onChange={(e) => setdepartment(e.target.value)}
                                />
                            </div>

                            <div >
                                <button type="submit" className="btn btn-primary mt-2">
                                    Create
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUser
