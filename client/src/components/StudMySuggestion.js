import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from 'primereact/dialog';
import ReactPaginate from 'react-paginate';
import StudentSidebar from './StudentSidebar'

const StudMySuggestion = () => {

    const [data, setData] = useState([])
    const [userData, setuserData] = useState('')
    const [title, settitle] = useState("");
    const [description, setDescription] = useState("");
    const [visible, setVisible] = useState(false)
    const [uniqueId, setUniqueId] = useState('')

    const email = window.localStorage.getItem("email");

    useEffect(() => {

        getUserDetails()
        getMySuggestion()


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

    const getMySuggestion = () => {
        fetch("http://localhost:4000/student/stud-suggestion", {
            method: "POST",
            crossDomian: true,
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
                console.log(data.data);
                setData(data.data)



            })
    }



    const deleteTopic = (topicId, title) => {

        if (window.confirm(`Are you sure you wante to remove ${title}`)) {


            fetch("http://localhost:4000/student/delete-suggested-topic", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    topicId: topicId,

                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);
                    getMySuggestion();


                })
        }
    }


    const editTopic = (topicId, title, supervisor, description) => {
        console.log(topicId, title, supervisor, description);

        if (window.confirm(`Are you sure you want to Edit ${title}`)) {

            setVisible(true)
            setUniqueId(topicId)
            setDescription(description)
            settitle(title)

        }


    }



    const saveTopic = (id) => {
        console.log(id);

        if (window.confirm("Are you sure you want to save changes")) {


            fetch("http://localhost:4000/student/update-suggested-topic", {
                method: "PATCH",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({

                    title: title,
                    description: description,
                    id: uniqueId
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);

                    window.location.href = "/mysuggestion"




                })

        }

    }


    return (
        <div className='app'>
            <div className="col-2 p-0">
                <StudentSidebar />
            </div>


            <div className="col-9 m-5">

                <div><a onClick={getMySuggestion}><h3>My suggestions</h3></a></div>
                {data.length > 0 ? <div>
                    <table className="table table-striped table-hover allborder">
                        <tbody>
                            <tr>
                                <th className="table-active">Title</th>
                                <th className="table-active">Description &nbsp; &nbsp;   </th>
                                <th className="table-active">Edit</th>
                                <th className="table-active">Delete</th>



                            </tr>
                            {data.map(m => (
                                <tr key={m._id}>
                                    <td>{m.title} </td>
                                    <td>{m.description} </td>
                                    <td><FontAwesomeIcon icon={faPenSquare} style={{ cursor: ' pointer' }} onClick={() => { editTopic(m._id, m.title, m.supervisor, m.description) }} /></td>
                                    <td>
                                        <FontAwesomeIcon icon={faTrash} style={{ cursor: ' pointer' }} onClick={() => deleteTopic(m._id, m.title)} ></FontAwesomeIcon>
                                    </td>



                                </tr>))}

                        </tbody>
                    </table>
                </div> : null}
            </div>


            <Dialog header="Edit Announcement" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>


                <div className="m-0">
                    <div >
                        <div className="row">
                            <div className="col-md-8">
                                <div className="p-3 py-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex flex-row align-items-center back"><i className="fa fa-long-arrow-left mr-1 mb-1"></i>
                                            <a href="/viewstudstaff/students" >Go Back</a>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-6">Title<input type="text" className="form-control" placeholder={title} value={title} onChange={(e) => settitle(e.target.value)} /></div>


                                    </div>
                                    <div className="row mt-3">

                                        <div className="col-md-6 ">Description<textarea type="text" className="form-control" placeholder={description} value={description} onChange={(e) => setDescription(e.target.value)} /></div>

                                    </div>
                                    <div className="mt-5 text-right"><button onClick={() => saveTopic(uniqueId)} className="btn btn-primary profile-button" type="button">Save Topic</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>


        </div>
    )
}

export default StudMySuggestion
