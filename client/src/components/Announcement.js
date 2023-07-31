import React, { useEffect, useState, useRef } from 'react'
import Sidebar from './Sidebar'
import ReactPaginate from 'react-paginate';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";

import { faBullhorn } from '@fortawesome/free-solid-svg-icons';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog } from 'primereact/dialog';

const Announcement = () => {

    const [userType, setUserType] = useState("")
    const [subject, setSubject] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [uniqueId, setUniqueId] = useState("");
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)

    const [limit, setLimit] = useState(1)
    const currentPage = useRef();
    const [pageCount, setPageCount] = useState(1)

    useEffect(() => {

        currentPage.current = 1;
        getAnnouncement();
    }, [])

    function getAnnouncement() {
        fetch(`http://localhost:4000/admin/getannouncement?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.result)

                setPageCount(data.pageCount)

            })
    }




    const handleSubmit = (e) => {


        e.preventDefault();

        fetch("http://localhost:4000/admin/announcement", {
            method: "POST",
            crossDomian: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                user: userType,
                subject: subject,
                announcement: announcement,

            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.result)

                setAnnouncement("");
                setSubject("");
                alert(data.data)
                window.location.href = "./announcement"




            })



            .catch((err) => {
                console.error(err);
            });
    }


    function handlePageClick(e) {
        console.log(e);
        currentPage.current = e.selected + 1;
        getAnnouncement();

    }
    function changeLimit() {
        currentPage.current = 1;
        getAnnouncement();
    }

    const editAnnnouncement = (id, subject, user, announcement) => {
        setSubject(subject);
        setUserType(user);
        setAnnouncement(announcement);
        setUniqueId(id);
        setVisible(true)
    }

    const toggleAnnouncement = (id) => {
        console.log(id);
        if (window.confirm(`Are you sure you want to change the status`)) {


            fetch("http://localhost:4000/admin//announcementstatus", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    announcementid: id,

                }),
            }).then((res) => res.json())
                .then(() => {

                    getAnnouncement();

                })
        }
    }

    const saveAnnouncement = (id) => {
        console.log(userType, id);
        if (window.confirm("Are you sure you want to save changes")) {


            fetch("http://localhost:4000/admin/updateannouncement", {
                method: "PATCH",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({

                    subject: subject,
                    user: userType,
                    announcement: announcement,
                    id: id
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);
                    window.location.href = "./announcement"




                })

        }

    }


    const deleteAnnouncement = (id, subject, user) => {
        console.log(id, subject, user);
        if (window.confirm(`Are you sure you want to delete ${subject}`)) {

            fetch("http://localhost:4000/admin/deleteannouncement", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    announcementId: id,
                    subject: subject,
                    user
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);
                    getAnnouncement();


                })
        }

    }


    if (data.length === 0) {
        return (
            <div className='app' >
                <div className="col-2 p-0">
                    <Sidebar />
                </div>

                <div className="col-9 p-0 m-5">
                    <form className='justify-content-center mb-5' onSubmit={handleSubmit}   >
                        <input
                            type="radio"
                            required
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

                        <div >
                            <div className="form-floating mb-3">
                                <textarea value={subject} onChange={(e) => setSubject(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Enter the subject"></textarea>
                                <label >SUBJECT</label>
                            </div>

                            <div className="form-floating">
                                <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="anouncement"></textarea>
                                <label htmlFor="floatingPassword">ANNOUNCEMENT</label>
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">Announce</button>
                        </div>


                    </form>
                </div>
            </div>)
    }


    return (
        <div className='app' >
            <div className="col-2 p-0">
                <Sidebar />
            </div>

            <div className="col-9 p-0 m-5">
                <form className='justify-content-center mb-5' onSubmit={handleSubmit}   >
                    <input
                        type="radio"
                        required
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

                    <div >
                        <div className="form-floating mb-3">
                            <textarea value={subject} onChange={(e) => setSubject(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Enter the subject"></textarea>
                            <label >SUBJECT</label>
                        </div>

                        <div className="form-floating">
                            <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="anouncement"></textarea>
                            <label htmlFor="floatingPassword">ANNOUNCEMENT</label>
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Announce</button>
                    </div>


                </form>

                <div  >
                    <table className="table table-striped table-hover allborder">
                        <tbody>
                            <tr>
                                <th>Subject</th>
                                <th>Announcement</th>
                                <th>User</th>
                                <th>Edit</th>
                                <th>Remove</th>
                                <th>Announce</th>
                                {/* <th>Announced</th> */}
                            </tr>
                            {data.map(m => (
                                <tr key={m._id}>
                                    <td>{m.subject}</td>
                                    <td>{m.announcement}</td>
                                    <td>{m.user}</td>
                                    <td><FontAwesomeIcon icon={faPenSquare} style={{ cursor: ' pointer' }} onClick={() => { editAnnnouncement(m._id, m.subject, m.user, m.announcement) }} /> </td>

                                    <td>
                                        <FontAwesomeIcon icon={faTrash} style={{ cursor: ' pointer' }} onClick={() => deleteAnnouncement(m._id, m.subject, m.user)}></FontAwesomeIcon>

                                    </td>
                                    {/* <td>
                                        <p onClick={() => toggleAnnouncement(m._id, m.subject, m.user)}>{m.announced ? < CampaignIcon style={{ cursor: ' pointer', color: "green" }} /> : < CampaignIcon style={{ cursor: ' pointer', color: "red" }} />} </p>
                                    </td> */}
                                    <td><p
                                        onClick={() => toggleAnnouncement(m._id)} >{m.announced ? <FontAwesomeIcon icon={faBullhorn} style={{ cursor: ' pointer', color: "green" }}></FontAwesomeIcon> : <FontAwesomeIcon icon={faBullhorn} style={{ cursor: ' pointer', color: "red" }}></FontAwesomeIcon>}</p>
                                    </td>


                                </tr>
                            ))}


                        </tbody>
                    </table>

                </div>

                <div className="d-flex justify-content-center">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                        marginPagesDisplayed={2}
                        containerClassName="pagination justify-content-center"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={currentPage.current - 1}
                    />

                    {/* <div className="p-1">
                        <input className="limit-width" placeholder="limit" onChange={e => setLimit(e.target.value)} />
                        <button className="btn btn-primary" onClick={changeLimit}>Set</button>
                    </div> */}


                    {/* <button type="button" class="btn pagination-limit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                            <select onChange={e => checkVal(e.target.value)} className='form-control form-group'>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>

                            </select>
                        </button> */}




                </div>

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
                                        <div className="col-md-6">Subject {data.subject}<input type="text" className="form-control" placeholder={subject} value={subject} onChange={(e) => setSubject(e.target.value)} /></div>

                                        <div className="col-md-6">User
                                            <select onChange={(e) => setUserType(e.target.value)} className='form-control form-group'>
                                                <option >choose one</option>
                                                <option value="Student" >Student</option>
                                                <option value="Supervisor" >Supervisor</option>
                                            </select>
                                            {/* <input type="text" className="form-control" placeholder={userType} value={userType} onChange={(e) => setUserType(e.target.value)} /></div> */}
                                        </div>
                                    </div>
                                    <div className="row mt-3">

                                        <div className="col-md-6 ">Announcement<textarea type="text" className="form-control" placeholder={announcement} value={announcement} onChange={(e) => setAnnouncement(e.target.value)} /></div>

                                    </div>
                                    <div className="mt-5 text-right"><button onClick={() => saveAnnouncement(uniqueId)} className="btn btn-primary profile-button" type="button">Save Announcement</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>


        </div >
    )
}

export default Announcement
