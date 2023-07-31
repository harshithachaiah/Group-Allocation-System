import React from 'react'
import ReactPaginate from 'react-paginate';
import { useState, useEffect, useRef } from 'react';
import SupervisorSidebar from './SupervisorSidebar'



const SupervisorViewGroup = () => {

    const [data, setData] = useState([])
    const [userData, setuserData] = useState('')


    const [limit, setLimit] = useState(5)

    const currentPage = useRef();
    const [pageCount, setPageCount] = useState(1)
    const [viewallocation, setViewallocation] = useState(false)

    const email = window.localStorage.getItem("email");



    useEffect(() => {

        currentPage.current = 1;

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



    function getAllocation() {

        fetch(`http://localhost:4000/supervisor/gettopics?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "TopicData");
                console.log(userData.email, data.result[0].email);

                setData(data.result)
                setPageCount(data.pageCount)
            })

    }
    function getAllocatedGroups() {

        fetch(`http://localhost:4000/supervisor/get-allocated-group?page=${currentPage.current}&limit=${limit}`, {
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
                console.log(data, "TopicData");


                setData(data.result)
                setPageCount(data.pageCount)


            })
    }

    const handlePageClick = (e) => {

        currentPage.current = e.selected + 1;
        getAllocation()


    }
    const getEmail = () => {
        for (var i = 0; i < data.length; i++) {

        }
    }

    if (viewallocation === false) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <SupervisorSidebar />
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

    if (pageCount === 0) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <SupervisorSidebar />
                </div>



                <div className="col-7 m-5">



                    <div className="card" >

                        <div className="card-body">


                            <h5 className="card-subtitle mb-2 text-muted">You have not been allocated to any groups</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Please contact Administrator</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }


    else {


        return (
            <div className='app'>
                <div className="col-2 p-0">
                    <SupervisorSidebar />
                </div>
                <div className="col-10 p-0">


                    <div><a onClick={getAllocatedGroups}><h3>Grouping</h3></a></div>
                    {data.length > 0 ? <div>
                        <table className="table table-striped table-hover allborder">
                            <tbody>
                                <tr>
                                    <th className="table-active">Title</th>
                                    <th className="table-active">Code &nbsp; &nbsp;   </th>
                                    <th className='table-active'>Supervisor</th>
                                    <th className='table-active'>Students</th>

                                </tr>
                                {data.map(m => (
                                    <tr key={m._id}>
                                        <td>{m.title} </td>
                                        <td>{m.code} </td>
                                        <td>{m.supervisor}</td>
                                        <td>
                                            {(m.allocatedstudents.length === 0) ? <td>na</td> : <ul>
                                                {m.allocatedstudents.map((email) => (
                                                    <li key={email}>{email}</li>
                                                ))}
                                            </ul>} </td>

                                    </tr>))}

                            </tbody>
                        </table>

                        <div className="d-flex justify-content-center" >
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
                    </div> : null}
                </div>
            </div >
        )
    }
}

export default SupervisorViewGroup
