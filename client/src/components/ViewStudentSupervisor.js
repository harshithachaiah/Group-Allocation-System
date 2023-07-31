import { useEffect, useRef, useState } from "react"
import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./Sidebar";
import ReactPaginate from 'react-paginate';




import { Dialog } from 'primereact/dialog';
import { Button } from "bootstrap";



export default function ViewStudentSupervisor() {
    const [data, setData] = useState([])
    const { type } = useParams();
    const [limit, setLimit] = useState(5)
    const [pageCount, setPageCount] = useState(1)
    const currentPage = useRef();
    const [firstName, setFirstName] = useState('')
    const [surName, setSurName] = useState('')

    const [uniqueId, setUniqueId] = useState('')
    const [user, setUser] = useState('')
    const [department, setDepartment] = useState('')
    const [userDetails, setUserDetails] = useState({});
    const [visible, setVisible] = useState(false)

    const [searchContent, setSearchContent] = useState("")
    const [searching, setSearching] = useState(false)


    useEffect(() => {
        // getStudSupervisor();
        currentPage.current = 1;

        if (searching) {
            searchUser();

        }
        else {
            paginatedSupervisorStud();

        }


    }, []);

    const getStudSupervisor = () => {
        // let URL = "";
        // if (type === "students") {
        //     URL = "http://localhost:4000/student/getallstudents"
        // } else if (type === "supervisors") {
        //     URL = "http://localhost:4000/supervisor/getallsupervisors"
        // }

        // fetch(URL, {
        //     method: "GET",
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data, "Data");
        //         setData(data.data)


        //     })
    }
    const deleteUser = (id, firstName, userType) => {
        if (window.confirm(`Are you sure you want to delete ${firstName}`)) {

            fetch("http://localhost:4000/admin/deleteuser", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    userid: id,
                    name: firstName,
                    userType
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);
                    paginatedSupervisorStud();

                })


        }
        else {

        }
    }

    const toggleStatus = (id, firstName, userType) => {

        if (window.confirm(`Are you sure you want to change the status of ${firstName}`)) {


            fetch("http://localhost:4000/admin/activitystatus", {
                method: "POST",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    userid: id,
                    name: firstName,
                    userType
                }),
            }).then((res) => res.json())
                .then(() => {

                    paginatedSupervisorStud();

                })
        }
    }

    function handlePageClick(e) {
        console.log(e);
        currentPage.current = e.selected + 1;
        if (searching) {
            searchUser();

        }
        else {
            paginatedSupervisorStud();

        }

    }
    function changeLimit() {
        currentPage.current = 1;
        if (searching) {
            searchUser();

        }
        else {
            paginatedSupervisorStud();

        }
    }

    function checkVal(e) {
        console.log(e);
        setLimit(e);
        changeLimit();
    }

    function paginatedSupervisorStud() {
        let URL = "";
        if (type === "students") {
            URL = `http://localhost:4000/student/getallstudents?page=${currentPage.current}&limit=${limit}`
        } else if (type === "supervisors") {
            URL = `http://localhost:4000/supervisor/getallsupervisors?page=${currentPage.current}&limit=${limit}`
        }

        fetch(URL, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.result)
                setPageCount(data.pageCount);


            })
    }

    const editUser = (id, firstName, userType, surName, department, sId) => {
        console.log(id, firstName, userType, surName, department, sId);
        setUserDetails({ id, firstName, userType, surName, department, sId });
        setUniqueId(id)
        setUser(userType)

        setVisible(true)
    }



    const saveProfile = (id) => {
        console.log(uniqueId, firstName, surName, department);
        if (window.confirm("Are you sure you want to save changes")) {
            let URL = "";
            if (user === "Student") {
                URL = "http://localhost:4000/student/update-userDetails"
            } else if (user === "Supervisor") {
                URL = "http://localhost:4000/supervisor/update-userDetails"
            }

            fetch(URL, {
                method: "PATCH",
                crossDomian: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    id: uniqueId,
                    firstName: firstName,
                    surName: surName,

                    department: department
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);
                    if (user === "Student") {
                        window.location.href = "/viewstudstaff/students"
                    }
                    else if (user === "Supervisor") {
                        window.location.href = "/viewstudstaff/supervisors"
                    }



                })

        }
    }



    const searchUser = (e) => {




        console.log(searchContent);
        setSearching(true)
        if (searchContent !== "" || searchContent === null) {

            let URL = "";
            if (type === "students") {
                URL = `http://localhost:4000/admin/search-students/${searchContent}?page=${currentPage.current}&limit=${limit}`
            } else if (type === "supervisors") {
                URL = `http://localhost:4000/admin/search-supervisors/${searchContent}?page=${currentPage.current}&limit=${limit}`
            }

            fetch(URL, {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data, "Data");
                    setData(data.result)
                    setPageCount(data.pageCount);


                })
        }
        else {
            paginatedSupervisorStud();
        }


    }
    if (pageCount === 0) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <Sidebar />
                </div>



                <div className="col-7 m-5">
                    <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)}></input><FontAwesomeIcon onClick={searchUser} icon={faSearch}>Search</FontAwesomeIcon></div>

                    {/* <p className="text-end">
                        {user === "students" ? <a href="/viewstudstaff/students">{user}</a> : <a href="/viewstudstaff/supervisors">Load Topics</a>}
                    </p> */}

                    <div className="card" >

                        <div className="card-body">


                            <h6 className="card-subtitle mb-2 text-muted">No Records to display</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }

    else {


        return (

            <div className='app' >
                <div className="col-2 p-0">
                    <Sidebar />
                </div>

                <div className='col-10 p-0'>


                    <div >
                        <div className='text-center'><label><h4>List of {type}</h4></label></div>
                        <div><input required placeholder="Search email" onChange={(e) => setSearchContent(e.target.value)}></input><FontAwesomeIcon onClick={searchUser} icon={faSearch}>Search</FontAwesomeIcon></div>
                        {data.length > 0 ?
                            <table className="table table-striped table-hover allborder">
                                <tbody>
                                    <tr>
                                        <th>Name</th>

                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                        <th>Status</th>
                                    </tr>

                                    {data.map(m => (
                                        <tr key={m._id}>
                                            <td>{m.firstName} {m.surName}</td>
                                            {/* {m.userType === "Student" ? <td>{m.studentId} </td> : <td>{m.supervisorId} </td>} */}
                                            <td>{m.email}</td>
                                            <td>{m.department}</td>
                                            <td><FontAwesomeIcon icon={faPenSquare} style={{ cursor: ' pointer' }} onClick={() => { m.userType === "Student" ? editUser(m._id, m.firstName, m.userType, m.surName, m.department, m.studentId) : editUser(m._id, m.firstName, m.userType, m.surName, m.department, m.supervisorId) }} /> </td>

                                            <td>
                                                <FontAwesomeIcon icon={faTrash} style={{ cursor: ' pointer' }} onClick={() => deleteUser(m._id, m.firstName, m.userType)}></FontAwesomeIcon>

                                            </td>
                                            <td><p
                                                onClick={() => toggleStatus(m._id, m.firstName, m.userType)} >{m.userStatus ? <FontAwesomeIcon icon={faToggleOn} style={{ cursor: ' pointer', color: "green" }}></FontAwesomeIcon> : <FontAwesomeIcon icon={faToggleOn} style={{ cursor: ' pointer', color: "red" }}></FontAwesomeIcon>}</p>
                                            </td>


                                        </tr>


                                    ))}
                                </tbody>

                            </table> : null}



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



                    </div >
                </div>

                <Dialog header="Edit Profile" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>


                    <div className="m-0">
                        <div className="container rounded bg-white mt-5">
                            <div className="row">
                                <div className="col-md-4 border-right">
                                    <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="Admin" className="rounded-circle p-1 bg-primary" width="90" /><span className="font-weight-bold">{userDetails.firstName} {userDetails.surName}</span></div>
                                </div>
                                <div className="col-md-8">
                                    <div className="p-3 py-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="d-flex flex-row align-items-center back"><i className="fa fa-long-arrow-left mr-1 mb-1"></i>
                                                <a href="/viewstudstaff/students" >Go Back</a>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-6"> First Name<input type="text" className="form-control" placeholder={userDetails.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                                            <div className="col-md-6">Surname<input type="text" className="form-control" value={surName} onChange={(e) => setSurName(e.target.value)} placeholder={userDetails.surName} /></div>

                                        </div>
                                        <div className="row mt-3">

                                            <div className="col-md-6">Department<input type="text" min="0" max="999" className="form-control" placeholder={userDetails.department} value={department} onChange={(e) => setDepartment(e.target.value)} /></div>


                                        </div>
                                        <div className="mt-5 text-right"><button onClick={() => saveProfile(userDetails._id)} className="btn btn-primary profile-button" type="button">Save Profile</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>

            </div >
        )
    }
}