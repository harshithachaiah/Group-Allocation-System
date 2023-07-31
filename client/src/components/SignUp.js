import React from 'react'

import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react"
import "./SignUp.css"



const SignUp = () => {

    const [sName, setsName] = useState('')
    const [sId, setsId] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [userType, setUserType] = useState('')
    const [secretKey, setsecretKey] = useState('')

    const handleSubmit = (e) => {

        if (userType === "Supervisor" && secretKey !== "UniOfLeicester-test") {
            e.preventDefault();
            alert("Invalid Secret Key")
        }
        else {
            e.preventDefault();


            console.log(sName, sId, email, password);
            fetch("http://localhost:4000/user/registration", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    userName: sName,
                    userId: sId,
                    email: email,
                    password: password,
                    userType: userType

                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data, "User Registered");
                    if (data.status === "ok") {
                        alert("Registration Successful")
                        window.location.href = "./sign-in"

                    }
                })

            setsName("")
            setsId("")
            setemail("")
            setpassword("")
        }
    }



    return (


        <div >
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/sign-in">Group Allocation System</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/sign-in">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/sign-up">Sign Up</a>
                                {/* <a className="nav-link" href="/sign-uppage">Sign Up test</a> */}
                            </li>


                        </ul>

                    </div>
                </div>
            </nav>



            <form onSubmit={handleSubmit} >
                <div className='card-center'>
                    <div className='card m-5 p-4 '>



                        <h3 >Sign Up</h3>
                        Register as
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
                        {userType === "Supervisor" ? <div className="mb-3">
                            <label>Secret Key</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Secret Key"
                                value={secretKey}
                                onChange={(e) => setsecretKey(e.target.value)}
                            />
                        </div> : null}


                        <div >
                            <label>User Name</label>
                            <input
                                type="text"
                                placeholder="User name"
                                className="form-control"
                                value={sName}
                                onChange={(e) => setsName(e.target.value)}
                            />
                        </div>

                        <div >
                            <label>User ID</label>
                            <input type='number' placeholder="User ID" className="form-control"
                                value={sId}
                                onChange={(e) => setsId(e.target.value)}
                            />

                        </div>
                        <div className="mb-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>

                        <div >
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>

                        <div >
                            <button type="submit" className="btn btn-primary mt-2">
                                Sign Up
                            </button>
                        </div>
                        <p className="text-end">
                            Already registered <a href="/sign-in">sign in?</a>
                        </p>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default SignUp
