import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import SupervisorSidebar from './SupervisorSidebar';
import ReactPaginate from 'react-paginate';


import { useState, useRef } from 'react';


const AddTopic = () => {

    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");

    const [userData, setuserData] = useState('')
    const [randomNumber, setRandomNumber] = useState(null);
    const [code, setCode] = useState("");
    const [studentCode, setStudentCode] = useState("");

    const [data, setData] = useState([])
    const [limit, setLimit] = useState(2)
    const currentPage = useRef();
    const [pageCount, setPageCount] = useState(1)


    const [supervisoraddtopic, setsupervisoraddtopic] = useState(false)
    const [viewallocation, setviewallocation] = useState(false)



    useEffect(() => {
        currentPage.current = 1;

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
        getTimeline();
        getStudentSuggestion();


    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(topic, description, userData.email, userData.firstName + " " + userData.surName);
        fetch("http://localhost:4000/supervisor/uploadtopic", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                name: userData.firstName + " " + userData.surName,
                title: topic,
                description: description,
                email: userData.email,
                code: code
            }),
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "Topic updated") {
                    console.log(data, "Topic Uploaded");
                    alert("Topic updated")
                    setTopic("");
                    setDescription("");
                    setCode("");

                }
                else if (data.error === "Code Exists") {
                    alert("Code Exists try new code")

                }

            })



            .catch((err) => {
                console.error(err);
            });
    };

    const generateRandomNumber = () => {
        const min = 1000; // minimum value for 4-digit number
        const max = 9999; // maximum value for 4-digit number
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        setRandomNumber("CO" + randomNumber);
    };

    function getTimeline() {
        fetch("http://localhost:4000/admin/gettimeline", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Timeline");
                setsupervisoraddtopic(data.data.supervisoraddtopic)


            })

    }


    function getStudentSuggestion() {

        fetch(`http://localhost:4000/supervisor/get-stud-suggestion?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.result)

                setPageCount(data.pageCount)




            })

    }

    const handlePageClick = (e) => {

        currentPage.current = e.selected + 1;
        getStudentSuggestion()




    }
    function changeLimit() {
        currentPage.current = 1;
        getStudentSuggestion()

    }

    const approveSuggestion = (id) => {

        if (!studentCode) {
            alert("Generate and paste the code")
        }
        else {
            fetch("http://localhost:4000/supervisor/approve-suggestion", {
                method: "PATCH",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    id: id,
                    supervisor: userData.firstName + " " + userData.surName,
                    email: userData.email,
                    code: studentCode,
                    approved: true,


                }),
            }).then((res) => res.json())
                .then((data) => {

                    console.log(data.data);
                    alert(data.data);
                    getStudentSuggestion();




                })
        }

    }



    if (!supervisoraddtopic) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <SupervisorSidebar />
                </div>


                <div className="col-7 m-5">

                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Notification</h5>
                            <h6 className="card-subtitle mb-2 text-muted">This Page is currently unavailable</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }



    return (
        <div className='app' >
            <div className="col-2 p-0">

                <SupervisorSidebar />
            </div>
            <div className="col-9 p-0 m-3">
                <form className='justify-content-center' onSubmit={handleSubmit}   >

                    <div className="form-floating mb-3">
                        <textarea required value={topic} onChange={(e) => setTopic(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Enter the topic"></textarea>
                        <label >Topic title</label>
                    </div>

                    <div className="form-floating">
                        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Description"></textarea>
                        <label htmlFor="floatingPassword">Description</label>
                    </div>

                    <div className="form-floating mt-3">
                        <input required value={code} onChange={(e) => setCode(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Code"></input>
                        <label >Topic Code</label>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Upload Topic</button>
                </form >
                <div>
                    <button className="btn btn-primary mt-3" onClick={generateRandomNumber}>Generate Code</button>
                    {randomNumber && <p>Topic Code: {randomNumber}</p>}
                </div>

                {data.length === 0 ? null : <div >
                    <table className=" p-0 m-3 table table-striped table-hover allborder">
                        <tbody>
                            <tr>
                                <th className="table-active">Title</th>
                                <th className="table-active">Description</th>
                                <th className="table-active">Student</th>
                                <th className="table-active">Email</th>
                                <th className="table-active">Topic code</th>
                                <th className="table-active">Status</th>

                            </tr>
                            {data.map(m => (
                                <tr key={m._id}>
                                    <td>{m.title} </td>
                                    <td>{m.description} </td>

                                    <td>{m.supervisor}</td>
                                    <td>{m.email}</td>
                                    <td>  <input required onChange={(e) => setStudentCode(e.target.value)} type="text" className="form-control" id="floatingInput" placeholder="Generate Code"></input></td>
                                    <td><button className="btn btn-success mr-5 mt-1" onClick={() => approveSuggestion(m._id, m.email, m.title)} >Approve</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-5 d-flex justify-content-center" >
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
                    </div>
                </div>}


            </div>


        </div >
    )
}

export default AddTopic
