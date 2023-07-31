import React from 'react'
import StudentSidebar from './StudentSidebar';
import { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const StudentViewTopic = () => {
  const [data, setData] = useState([])

  const [limit, setLimit] = useState(5)
  const currentPage = useRef();
  const [pageCount, setPageCount] = useState(1)
  const [searchContent, setSearchContent] = useState("")
  const [searching, setSearching] = useState(false)

  useEffect(() => {

    currentPage.current = 1;
    if (searching) {
      searchTopic();

    }
    else {
      getTopics()

    }



  }, [])

  function getTopics() {
    fetch(`http://localhost:4000/student/gettopics?page=${currentPage.current}&limit=${limit}`, {
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
    if (searching) {
      searchTopic();

    }
    else {
      getTopics()

    }




  }

  function changeLimit() {
    currentPage.current = 1;
    if (searching) {
      searchTopic();

    }
    else {
      getTopics()

    }
  }

  const searchTopic = (e) => {


    console.log(searchContent);
    if (searchContent !== "" || searchContent === null) {

      setSearching(true);
      fetch(`http://localhost:4000/student/get-search-topic/${searchContent}?page=${currentPage.current}&limit=${limit}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "Data");

          setData(data.result)
          setPageCount(data.pageCount)

        })
    }
    else {
      getTopics();
    }


  }
  if (pageCount === 0) {
    return (

      <div className='app'>
        <div className="col-2 p-0">
          <StudentSidebar />
        </div>



        <div className="col-7 m-5">
          <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)}></input><FontAwesomeIcon onClick={searchTopic} icon={faSearch}>Search</FontAwesomeIcon></div>

          <p className="text-end">
            <a href="/studentviewtopic">Load Topics</a>
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
      <div className='app'>
        <div className="col-2 p-0">
          <StudentSidebar />
        </div>
        <div className="col-10 p-0">

          <div><label className='text-center'><h4>Topics</h4></label>

          </div>


          <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)}></input> <FontAwesomeIcon onClick={searchTopic} icon={faSearch}>Search</FontAwesomeIcon></div>
          {/* <p className="text-end">
            <a href="/studentviewtopic">Load Topics</a>
          </p> */}
          <table className="table table-striped table-hover allborder">
            <tbody>
              <tr>
                <th className="table-active">Topics</th>
                <th className="table-active">Description</th>
                <th className="table-active">Supervisor</th>
              </tr>
              {data.map(m => (
                <tr key={m._id}>
                  <td>{m.title} </td>
                  <td>{m.description} </td>

                  <td>{m.supervisor}</td>
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
        </div>

      </div >
    )
  }
}

export default StudentViewTopic
