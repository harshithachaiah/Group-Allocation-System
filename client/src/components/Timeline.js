import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'


const Timeline = () => {

    useEffect(() => {


        getTimeline();



    }, [])

    const [studentprefernce, setstudentprefernce] = useState(false)
    const [supervisorprefernce, setsupervisorprefernce] = useState(false)
    const [supervisoraddtopic, setsupervisoraddtopic] = useState(false)
    const [viewallocation, setviewallocation] = useState()

    const [userType, setUserType] = useState("")
    const [subject, setSubject] = useState("");
    const [announcement, setAnnouncement] = useState("");

    const toggleStatus = (val) => {

        console.log(val);
        fetch("http://localhost:4000/admin/toggle-timeline", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                val: val,

            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "Timelinestatus");
                getTimeline()

            })


    }
    function getTimeline() {
        fetch("http://localhost:4000/admin/gettimeline", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Timeline");
                // console.log(data.data.setsupervisorprefernce);
                setstudentprefernce(data.data.setstudentprefernce)
                setsupervisorprefernce(data.data.setsupervisorprefernce)
                setsupervisoraddtopic(data.data.supervisoraddtopic)
                setviewallocation(data.data.viewallocation)

                console.log(data.data.setstudentprefernce, supervisorprefernce, supervisoraddtopic, viewallocation);


            })

    }


    const handleSubmit = (e) => {
        console.log(userType, subject, announcement);


        e.preventDefault();

        fetch("http://localhost:4000/admin/email-notify", {
            method: "POST",
            crossDomian: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                userType: userType,
                subject: subject,
                announcement: announcement,

            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                alert(data.data)
                setAnnouncement("")
                setSubject("")
            })

            .catch((err) => {
                console.error(err);
            });
    }




    return (
        <div className='app' >
            <div className="col-2 p-0">

                <Sidebar />
            </div>
            <div className="col-8 p-0 m-3">
                <h3>Timeline </h3>
                <div className='col-10 mr-5 mt-3'>

                    {studentprefernce ? <button className="btn  btn-primary" onClick={() => toggleStatus("setstudentprefernce")}>Disable Students Preference</button> : <button className="btn btn-danger" onClick={() => toggleStatus("setstudentprefernce")}>Enable Students Preference</button>}
                </div>
                <div className='col-10 mr-5 mt-5'>
                    {supervisoraddtopic ? <button className="btn btn-primary" onClick={() => toggleStatus("supervisoraddtopic")}>Disable Supervisor Upload Topic</button> : <button className="btn btn-danger" onClick={() => toggleStatus("supervisoraddtopic")}>Enable Supervisor Upload Topic</button>}
                </div>
                {/* <div className='col-10 mr-5 mt-5'>
                    {supervisorprefernce ? <button className="btn btn-primary" onClick={() => toggleStatus("setsupervisorprefernce")}>Disable Supervisor Preference</button> : <button className="btn btn-danger" onClick={() => toggleStatus("setsupervisorprefernce")}>Enable Supervisor Preference</button>}
                </div> */}

                <div className='col-10 mr-5 mt-5 mb-3'>
                    {viewallocation ? <button className="btn btn-primary" onClick={() => toggleStatus("viewallocation")}>Disable View Allocation</button> : <button className="btn btn-danger" onClick={() => toggleStatus("viewallocation")}>Enable View Allocation</button>}
                </div>
                <div >
                    <h3>Notify Event</h3>
                    <form className='justify-content-center mb-5'
                        onSubmit={handleSubmit}
                    >
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
                                <textarea
                                    onChange={(e) => setSubject(e.target.value)}
                                    value={subject}
                                    type="text" className="form-control" id="floatingInput" placeholder="Enter the subject"></textarea>
                                <label >SUBJECT</label>
                            </div>

                            <div className="form-floating">
                                <textarea
                                    onChange={(e) => setAnnouncement(e.target.value)}
                                    value={announcement}
                                    type="text" className="form-control" id="floatingInput" placeholder="anouncement"></textarea>
                                <label htmlFor="floatingPassword">Email Body</label>
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">Notify</button>
                        </div>


                    </form>
                </div>
            </div>


        </div>
    )
}

export default Timeline
