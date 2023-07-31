import React from 'react'
import StudentSidebar from './StudentSidebar'
import { useState, useEffect, useRef } from 'react';

const StudentViewGroup = () => {


    const [data, setData] = useState([])
    const [userData, setuserData] = useState('')
    const [groupMembers, setGroupMembers] = useState([])
    const [view, setView] = useState(false)
    const [viewallocation, setViewallocation] = useState(false)

    const email = window.localStorage.getItem("email");


    useEffect(() => {



        getUserDetails()
        getTimeline()
        getAllocatedGroups()



    }, [])


    function getTimeline() {
        fetch("http://localhost:4000/admin/gettimeline", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Timeline");
                setViewallocation(data.data.viewallocation)


            })

    }



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


    function getAllocatedGroups() {

        setView(true)
        fetch(`http://localhost:4000/student/get-stud-group`, {
            method: "POST",
            crossDomian: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({

                email: email

            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "Studebt group details");





                if (data.data !== null) {
                    setData(data.data)
                    setGroupMembers(data.data.allocatedstudents);
                }
                else {
                    setGroupMembers(null);
                    setData(null)
                }




            })
    }


    if (data === null) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <StudentSidebar />
                </div>





                <div className="col-7 m-5">

                    <div className="card" >

                        <div className="card-body">


                            <h5 className="card-subtitle mb-2 text-muted">You have not been assigned to any group</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Please contact Administrator</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }

    else if (viewallocation === false) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <StudentSidebar />
                </div>



                <div className="col-7 m-5">



                    <div className="card" >

                        <div className="card-body">


                            <h6 className="card-subtitle mb-2 text-muted">Group Allocation has not yet been finalised.</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }



    return (
        <div>
            <div className='app'>
                <div className="col-2 p-0">
                    <StudentSidebar />
                </div>

                <div className="col-9 m-5 p-0">
                    <div><a onClick={getAllocatedGroups}><h3>Grouping</h3></a></div>
                    {(view && data !== null) ? <div>
                        <table className="table table-striped table-hover allborder">
                            <tbody>
                                <tr>
                                    <th className="table-active">Title</th>
                                    <th className="table-active">Code &nbsp; &nbsp;   </th>
                                    <th className='table-active'>Supervisor</th>
                                    <th className='table-active'>Group Members</th>

                                </tr>
                                <tr>
                                    <td>{data.title} </td>
                                    <td>{data.code} </td>
                                    <td>{data.supervisor}</td>
                                    {(groupMembers === null) ? <td>NA</td> : <td> <ul>
                                        {groupMembers.map((student) => (
                                            <li key={student}>{student}</li>
                                        ))}
                                    </ul></td>}
                                </tr>


                            </tbody>
                        </table>
                    </div> : null}


                </div>
            </div>

        </div>
    )
}

export default StudentViewGroup
