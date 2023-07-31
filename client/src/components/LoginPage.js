import React from 'react'
import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const eye = <FontAwesomeIcon icon={faEye} />;



const LoginPage = () => {






    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [passwordType, setPasswordtype] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
        let studentEmail = "student.le.ac.uk";
        let superviserEmail = "leicester.ac.uk";
        let adminEmail = "admin.leicester.ac.uk";
        if (email.includes(adminEmail)) {

            console.log(email, password);

            fetch("http://localhost:4000/admin/login", {
                method: "POST",
                crossDomain: true,
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
                    console.log(data, "Admin Login Successful");
                    if (data.status === "ok") {
                        alert("Loggedin as Admin")
                        window.localStorage.setItem("token", data.data);
                        window.localStorage.setItem("email", email)
                        window.localStorage.setItem("loggedIn", true)
                        window.location.href = "./admindashboard"


                    }

                })
        }
        else if (email.includes(studentEmail)) {
            console.log(email, password);

            fetch("http://localhost:4000/student/login", {
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
                    console.log(data, " Student Login Successful");
                    if (data.status === "ok") {
                        alert("Loggedin as Student")
                        window.localStorage.setItem("token", data.data);
                        window.localStorage.setItem("loggedIn", true)
                        window.localStorage.setItem("email", email)
                        window.location.href = "./studentdashboard"


                    }
                    else if (data.error === "Invalid Credentials") {
                        alert("Enter Valid Credentials")

                    }
                    else if (data.error === "Temporary Disabled") {
                        alert("Account has been Temporaryly Disabled!! Please contact Admin")
                    }
                    else if (data.error === "User Not Found") {
                        alert("Account doesn't exist")
                    }

                })


        }
        else if (email.includes(superviserEmail)) {

            console.log(email, password);

            fetch("http://localhost:4000/supervisor/login", {
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

                    if (data.status === "ok") {
                        console.log(data, "Supervisor Login Successful");
                        alert("Loggedin as Supervisor")
                        window.localStorage.setItem("token", data.data);
                        window.localStorage.setItem("loggedIn", true)
                        window.localStorage.setItem("email", email)
                        window.location.href = "./supervisordashboard"


                    }
                    else if (data.error === "Invalid Credentials") {
                        alert("Enter Valid Credentials")

                    }
                    else if (data.error === "Temporary Disabled") {
                        alert("Account has been Temporaryly Disabled!! Please contact Admin")
                    }
                    else if (data.error === "User Not Found") {
                        alert("Account doesn't exist")
                    }


                })
                .catch((error
                ) => {
                    console.log(error);
                })


        }
        else {
            alert("Invalid Details")
        }


    }
    const showPassword = () => {
        setPasswordtype(!passwordType)

    }
    return (
        <div id="login-page" >
            <form id="login-form" onSubmit={handleSubmit} className='card body'>
                <div className='card-center'>
                    <div className='card m-5 p-4'>
                        <h3 className='text-center'>Sign In</h3>
                        <div >
                            <label>Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setemail(e.target.value)} />
                        </div>

                        <div >
                            <label>Password</label>
                            <div className='password-container'>
                                <input className='form-control'
                                    type={passwordType ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                ></input>
                                <i onClick={showPassword}>{eye}</i>
                            </div>
                        </div>

                        <div >
                            <p className="text-end">
                                Forgot <a href="/reset-password">password?</a>
                            </p>
                        </div>

                        <div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>

                        <p className="text-end">

                            Not a member? <a href="/sign-up">Register</a>
                        </p>
                    </div>
                </div>
            </form>
        </div>




    )
}
export default LoginPage
