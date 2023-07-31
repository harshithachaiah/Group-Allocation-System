import React from 'react'
import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.css';

const Login = () => {


    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);

        fetch("http://localhost:4000/user/login", {
            method: "POST",
            crossDomian: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({

                email: email,
                password: password
            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "Login Successful");
                if (data.status === "ok") {
                    alert("Login Successful")
                    window.localStorage.setItem("token", data.data);
                    window.localStorage.setItem("loggedIn", true)
                    window.location.href = "./user-details"


                }

            })


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


            <form onSubmit={handleSubmit} className='card'>
                <div className='card-center'>
                    <div className='card m-5 p-4 '>

                        <h3 >Sign In</h3>



                        <div >
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
                            <div className="text-end" >
                                <input
                                    type="checkbox"
                                    id="customCheck1"
                                />
                                <label  >
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        {/* <p className="text-end">
                            Forgot <a href="#">password?</a>
                        </p> */}
                    </div>
                </div>
            </form>

        </div>



    )
}

export default Login
