import React from 'react'
import { useEffect, useRef, useState } from "react"
import Sidebar from './Sidebar'
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from 'primereact/dialog';
import { faSearch } from "@fortawesome/free-solid-svg-icons";


const AdminViewPreferences = () => {

    const [limit, setLimit] = useState(5)
    const [pageCount, setPageCount] = useState(1)
    const currentPage = useRef();
    const [data, setData] = useState([])
    const [pref1, setPref1] = useState("");
    const [pref2, setPref2] = useState("");
    const [pref3, setPref3] = useState("");
    const [pref4, setPref4] = useState("");
    const [visible, setVisible] = useState(false)
    const [topicData, setTopicData] = useState([])


    const [preference1, setPreference1] = useState("");
    const [preference2, setPreference2] = useState("");
    const [preference3, setPreference3] = useState("");
    const [preference4, setPreference4] = useState("");

    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");
    const [id3, setId3] = useState("");
    const [id4, setId4] = useState("");

    const [uniqueStudId, setUniqueStudId] = useState("");


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
        getTopics();


    }, []);

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

    function paginatedSupervisorStud() {
        // let URL = "";
        // if (type === "students") {
        //     URL = `http://localhost:4000/student/getallstudents?page=${currentPage.current}&limit=${limit}`
        // } else if (type === "supervisors") {
        //     URL = `http://localhost:4000/supervisor/getallsupervisors?page=${currentPage.current}&limit=${limit}`
        // }

        fetch(`http://localhost:4000/student/getallstudents?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.result)
                setPageCount(data.pageCount);


            })
    }

    const editPref = (studentId, title) => {
        console.log(studentId);

        if (window.confirm(`Are you sure you want to Edit ${title}`)) {

            setVisible(true)
            setUniqueStudId(studentId)
            //   setDescription(description)
            //   settitle(title)

        }


    }


    function getTopics() {
        fetch("http://localhost:4000/student/getpreftopics", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "TopicData");
                setTopicData(data.data)



            })

    }

    const save = () => {

        fetch("http://localhost:4000/admin/savepreference", {
            method: "PATCH",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                id: uniqueStudId,


                preference1: { id: id1, preference: preference1 },
                preference2: { id: id2, preference: preference2 },
                preference3: { id: id3, preference: preference3 },
                preference4: { id: id4, preference: preference4 }

            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data.data);

            })

    }

    const handleOptionChange1 = (id, topic) => {
        console.log(id, topic);


        setPreference1(topic);
        setId1(id);
    }
    const handleOptionChange2 = (id, topic) => {
        console.log(id, topic);
        setPreference2(topic);
        setId2(id);
    }
    const handleOptionChange3 = (id, topic) => {
        console.log(id, topic);
        setPreference3(topic);
        setId3(id);
    }
    const handleOptionChange4 = (id, topic) => {
        console.log(id, topic);
        setPreference4(topic);
        setId4(id);
    }


    const searchUser = (e) => {




        console.log(searchContent);
        setSearching(true)
        if (searchContent !== "" || searchContent === null) {


            URL = `http://localhost:4000/admin/search-students/${searchContent}?page=${currentPage.current}&limit=${limit}`


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

                    <p className="text-end">
                        <a href="/adminviewpreference">List Preferences</a>
                    </p>

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
                        <div className='text-center'><label><h4>Student Preference</h4></label>
                            {/* <div ><input placeholder="Search"></input> <FontAwesomeIcon icon={faSearch}>Search</FontAwesomeIcon></div> */}

                        </div>
                        <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)}></input><FontAwesomeIcon onClick={searchUser} icon={faSearch}>Search</FontAwesomeIcon></div>

                        {data.length > 0 ?
                            <table className="table table-striped table-hover allborder">
                                <tbody>
                                    <tr>
                                        <th>Name</th>

                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Preferences</th>

                                        <th>Edit</th>


                                    </tr>

                                    {data.map(m => (
                                        <tr key={m._id}>
                                            <td>{m.firstName} {m.surName}</td>
                                            {/* {m.userType === "Student" ? <td>{m.studentId} </td> : <td>{m.supervisorId} </td>} */}
                                            <td>{m.email}</td>
                                            <td>{m.department}</td>
                                            <td>{m.date.slice(0, 10)}</td>
                                            {(!m.preference1 || !m.preference2 || !m.preference3 || !m.preference4) ? <td>NA</td> : <td>
                                                <li>{!m.preference1 ? "" : m.preference1.preference}</li>
                                                <li>{!m.preference2 ? "" : m.preference2.preference}</li>
                                                <li>{!m.preference3 ? "" : m.preference3.preference}</li>
                                                <li>{!m.preference4 ? "" : m.preference4.preference}</li>
                                            </td>}
                                            <td><FontAwesomeIcon icon={faPenSquare} style={{ cursor: ' pointer' }} onClick={() => { editPref(m._id, m.firstName) }} /></td>

                                            {/* <td>{(m.preference1 !== null || m.preference1 !== undefined) ? m.preference1 : "Not Set"}</td> */}
                                            {/* <td>{m.preferance2.preferance}</td>
                                        <td>{m.preferance3.preferance}</td>
                                        <td>{m.preferance4.preferance}</td> */}


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
                <Dialog header="Edit Student Preference" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>


                    <div className="m-0">
                        <div >
                            <div><label>List of Topics</label></div>
                            <form onSubmit={save}>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <th className="table-active">Topics</th>

                                            <th className="table-active"></th>


                                            <th className="table-active">Preferences</th>
                                            <th className="table-active"></th>
                                            <th className="table-active"></th>
                                        </tr>
                                        {topicData.map(m => (
                                            <tr key={m._id}>
                                                <td>{m.title} </td>

                                                <td >
                                                    <input
                                                        type="radio"
                                                        className='m-2'
                                                        name="Preference1"
                                                        value="Preference 1"
                                                        required
                                                        onChange={(e) => handleOptionChange1(m._id, m.title)}
                                                    // onChange={(e) => setUserType(e.target.value)}
                                                    />{" "}

                                                    1
                                                </td>
                                                <td >
                                                    <input
                                                        type="radio"
                                                        className='m-2'
                                                        name="Preference2"
                                                        value="Preference 2"
                                                        required
                                                        onChange={(e) => handleOptionChange2(m._id, m.title)}
                                                    // onChange={(e) => setUserType(e.target.value)}
                                                    />{" "}

                                                    2
                                                </td>
                                                <td >
                                                    <input
                                                        type="radio"
                                                        className='m-2'
                                                        name="Preference3"
                                                        value="Preference 3"
                                                        required
                                                        onChange={(e) => handleOptionChange3(m._id, m.title)}
                                                    // onChange={(e) => setUserType(e.target.value)}
                                                    />{" "}

                                                    3
                                                </td>
                                                <td >
                                                    <input
                                                        type="radio"
                                                        className='m-2'
                                                        name="Preference4"
                                                        value="Preference 4"
                                                        required
                                                        onChange={(e) => handleOptionChange4(m._id, m.title)}
                                                    // onChange={(e) => setUserType(e.target.value)}
                                                    />{" "}

                                                    4
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-center" >

                                    <button type='submit' className="btn btn-success" >Save</button>
                                    {/* onClick={save(userData._id)} */}
                                </div>
                            </form>



                        </div>
                    </div>
                </Dialog>


            </div>
        )
    }
}

export default AdminViewPreferences
