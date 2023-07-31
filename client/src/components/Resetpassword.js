import React from 'react'
import { useState } from "react"

const Resetpassword = () => {
    const [email, setemail] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:4000/user//forgot-password", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({

                email: email,

            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, " Data");
                alert(data.status)
                if (data.status === "Email sent") {

                    window.location.href = "./sign-in"

                }






            })

    }
    return (
        <div>

            <form id="login-form" onSubmit={handleSubmit} className='card body'>
                <div className='card-center'>
                    <div className='card m-5 p-4'>
                        <h3 className='text-center'>Forgotten Password</h3>
                        <div >
                            <label>Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setemail(e.target.value)} />
                        </div>
                        <div >
                            <p className="text-end">
                                <a href="/sign-in">Go Back</a>
                            </p>
                        </div>



                        <div>
                            <button type="submit" className="btn btn-primary mt-3">
                                Submit
                            </button>
                        </div>

                    </div>
                </div>
            </form>


        </div>
    )
}

export default Resetpassword
