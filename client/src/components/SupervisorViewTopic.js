import React from 'react'
import SupervisorSidebar from './SupervisorSidebar';
import { useState, useEffect, useRef } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from 'primereact/dialog';
import ReactPaginate from 'react-paginate';
import { grey } from '@material-ui/core/colors';
import { faSearch } from "@fortawesome/free-solid-svg-icons";



const SupervisorViewTopic = () => {
  const [data, setData] = useState([])
  const [userData, setuserData] = useState('')

  const [limit, setLimit] = useState(4)
  const currentPage = useRef();
  const [pageCount, setPageCount] = useState(1)

  const [visible, setVisible] = useState(false)
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [uniqueId, setUniqueId] = useState("");

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
    getUserDetails();



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

  function getTopics() {

    fetch(`http://localhost:4000/supervisor/gettopics?page=${currentPage.current}&limit=${limit}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "TopicData");
        setData(data.result)

        setPageCount(data.pageCount)
      })
  }


  const deleteTopic = (topicId, title) => {
    console.log(topicId, title, userData.email);

    if (window.confirm(`Are you sure you wante to remove ${title}`)) {


      fetch("http://localhost:4000/supervisor/deletetopic", {
        method: "POST",
        crossDomian: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          topicId: topicId,
          email: userData.email

        }),
      }).then((res) => res.json())
        .then((data) => {
          console.log(data.data);
          alert(data.data);
          getTopics();


        })
    }
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





  const editTopic = (topicId, title, supervisor, description) => {
    console.log(topicId, title, supervisor, description, userData.email);

    if (window.confirm(`Are you sure you want to Edit ${title}`)) {
      fetch("http://localhost:4000/supervisor/supervisortopiccheck", {
        method: "POST",
        crossDomian: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          topicId: topicId,
          email: userData.email

        }),
      }).then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "ok") {
            setVisible(true)
            setUniqueId(topicId)
            setDescription(description)
            settitle(title)
            setSupervisor(supervisor)


          }
          if (data.status === "error") {

            alert("Cannot Edit!! Topic uploaded by someone else")
          }

        })


    }


  }


  const saveTopic = (id) => {
    console.log(id);

    if (window.confirm("Are you sure you want to save changes")) {


      fetch("http://localhost:4000/supervisor/updatetopic", {
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

          window.location.href = "/supervisorviewtopic"




        })

    }

  }

  const searchTopic = (e) => {


    console.log(searchContent);
    if (searchContent !== "" || searchContent === null) {

      setSearching(true);
      fetch(`http://localhost:4000/supervisor/get-search-topic/${searchContent}?page=${currentPage.current}&limit=${limit}`, {
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
          <SupervisorSidebar />
        </div>



        <div className="col-7 m-5">
          <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)}></input><FontAwesomeIcon onClick={searchTopic} icon={faSearch}>Search</FontAwesomeIcon></div>

          <p className="text-end">
            <a href="/supervisorviewtopic">Load Topics</a>
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
          <SupervisorSidebar />
        </div>
        <div className="col-10 p-0">
          <div>

            <div><label className='text-center'><h4>Topics</h4></label></div>
            <div><input required placeholder="Search" onChange={(e) => setSearchContent(e.target.value)}></input> <FontAwesomeIcon onClick={searchTopic} icon={faSearch}>Search</FontAwesomeIcon></div>
            <table className="table table-striped table-hover allborder">
              <tbody>
                <tr>
                  <th className="table-active">Title</th>
                  <th className="table-active">Code &nbsp; &nbsp;   </th>
                  <th className="table-active">Description</th>
                  <th className='table-active'>Supervisor</th>
                  <th className='table-active'>Edit</th>
                  <th className='table-active'>Remove</th>
                </tr>
                {data.map(m => (
                  <tr key={m._id}>
                    <td>{m.title} </td>
                    <td>{m.code} </td>
                    <td>{m.description} </td>
                    <td>{m.supervisor}</td>
                    <td>{userData.email === m.email ? <FontAwesomeIcon icon={faPenSquare} style={{ cursor: ' pointer' }} onClick={() => { editTopic(m._id, m.title, m.supervisor, m.description) }} /> : <FontAwesomeIcon icon={faPenSquare} style={{ cursor: ' pointer', color: "grey" }} />}</td>
                    <td>{userData.email === m.email ? <FontAwesomeIcon icon={faTrash} style={{ cursor: ' pointer' }} onClick={() => deleteTopic(m._id, m.title, m.email)} ></FontAwesomeIcon> : <FontAwesomeIcon icon={faTrash} style={{ cursor: ' pointer', color: "grey" }}  ></FontAwesomeIcon>}</td>


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
}

export default SupervisorViewTopic
