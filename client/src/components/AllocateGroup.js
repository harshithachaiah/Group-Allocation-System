import React from 'react'
import Sidebar from './Sidebar'
import { useState, useRef, useEffect } from 'react';
import ReactPaginate from 'react-paginate';




const AllocateGroup = () => {
    useEffect(() => {

        currentPage.current = 1;




    }, [])

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState("");
    const [studentNum, setStudentNum] = useState("");
    const [topicData, setTopicData] = useState("");

    const [limit, setLimit] = useState(2)
    const currentPage = useRef();
    const [pageCount, setPageCount] = useState(1)
    const [groupSize, setGroupSize] = useState(4)

    function getAllocation() {

        fetch(`http://localhost:4000/student/gettopics?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setTopicData(data.result)


                setPageCount(data.pageCount)
            })

    }

    const handlePageClick = (e) => {

        currentPage.current = e.selected + 1;
        getAllocation()



    }

    function changeLimit() {
        currentPage.current = 1;
        getAllocation();
    }




    const allocategroup = () => {
        if (groupSize == 0 || groupSize == 1) {
            alert("Enter group size greater than 2")
        }
        else {
            setIsLoading(true);

            fetch("http://localhost:4000/admin/allocate-stud", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    groupSize: groupSize,

                }),

            }).then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setData(data.data)
                    console.log(data.numStud);
                    setStudentNum(data.numStud)

                    setIsLoading(false);
                    getAllocation();


                })
        }

    }
    const allocategroupAlgo = () => {

        if (groupSize == 0 || groupSize == 1) {
            alert("Enter group size greater than 2")
        }

        else {
            setIsLoading(true);
            fetch("http://localhost:4000/admin/allocate-stud-preferred-topic", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    groupSize: groupSize,

                }),

            }).then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setData(data.data)
                    setStudentNum(data.numStud)

                    setIsLoading(false);
                    getAllocation();


                })
        }

    }
    const clearAllocation = () => {


        fetch("http://localhost:4000/admin/reset-allocation", {
            method: "PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },

        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert("Allocation Reset")
                window.location.href = "./allocategroup"




            })

    }

    function notifyAllocation() {

        fetch(`http://localhost:4000/admin/notify-allocation`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                alert(data.data)

            })

    }


    return (

        <div className='app' >
            <div className="col-2 p-0">
                <Sidebar />
            </div>


            <div className='col-10 mr-5 mt-5'>

                <div>
                    <button className="btn btn-primary mr-5 mt-0" onClick={clearAllocation}>Clear Allocation</button>
                </div>
                <div>
                    {/* <div >
                        <label>Group Size</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="enter size of group"
                            onChange={(e) => setGroupSize(e.target.value)}
                        />
                    </div> */}

                    <div><p> </p><input className="limit-width" placeholder="group size" onChange={e => setGroupSize(e.target.value)} /></div>
                    <button className="btn btn-primary mr-5 mt-2" onClick={allocategroup}>Allocate Group</button>
                    <div><a className=" mr-5 mt-2" onClick={getAllocation}>View Allocation</a></div>
                    <button className="btn btn-primary mr-5 mt-2" onClick={allocategroupAlgo}>Allocate Group Algo 2</button>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            {data.length > 0 ? <div><div><a className=" ml-5  mr-5 mt-2" onClick={notifyAllocation}>Send Email</a></div></div> : null}
                            {topicData.length > 0 ? <div>
                                {/* <p>Number of student {studentNum} </p> */}
                                <p>  </p>
                                <table className="table table-striped table-hover allborder">
                                    <tbody>
                                        <tr>
                                            <th>Title</th>
                                            <th>Code</th>
                                            <th>Supervisor</th>
                                            <th>Students</th>



                                        </tr>

                                        {topicData.map(m => (
                                            <tr key={m._id}>
                                                <td>{m.title}</td>
                                                <td>{m.code}</td>
                                                {(m.allocatedstudents.length === 0) ? <td>Unallocated</td> : <td>{m.supervisor}</td>}
                                                {(m.allocatedstudents.length === 0) ? <td>Unallocated</td> : <td>
                                                    <ul>
                                                        {m.allocatedstudents.map((email) => (
                                                            <li key={email}>{email}</li>
                                                        ))}
                                                    </ul></td>}




                                            </tr>


                                        ))}
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

                                    {/* <div className="p-1">
                                        <input className="limit-width" placeholder="limit" onChange={e => setLimit(e.target.value)} />
                                        <button className="btn btn-primary" onClick={changeLimit}>Set</button>

                                    </div> */}
                                </div>
                            </div> : null}




                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default AllocateGroup
