import React from 'react'
import "./Sidebar.css"
import { StudentSidebarData } from "./StudentSidebarData"
import { useState } from "react"
import { useEffect } from 'react'




function StudentSidebar() {


    // const [studentprefernce, setstudentprefernce] = useState("")
    // const [supervisorprefernce, setsupervisorprefernce] = useState("")
    // const [supervisoraddtopic, setsupervisoraddtopic] = useState("")
    // const [viewallocation, setviewallocation] = useState("")


    // useEffect(() => {
    //     getTimeline();
    // }, [])

    // function getTimeline() {
    //     fetch("http://localhost:4000/admin/gettimeline", {
    //         method: "GET",
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log(data, "Timeline");
    //             setstudentprefernce(data.data[0].setstudentprefernce.toString())
    //             setsupervisorprefernce(data.data[0].setsupervisorprefernce.toString())
    //             setsupervisoraddtopic(data.data[0].supervisoraddtopic.toString())
    //             setviewallocation(data.data[0].viewallocation.toString())

    //             console.log(studentprefernce, supervisorprefernce, supervisoraddtopic, viewallocation);



    //         })

    // }

    return (
        <div className="sidebarapp" >
            <ul className='SideBarlist'>
                {StudentSidebarData.map((val, key) => {
                    return (

                        < li className="row" key={key} id={window.location.pathname === val.link ? "active" : ""} onClick={() => { { window.location.pathname = val.link } }}>

                            {/* {(studentprefernce === "false" && val.title === ("Set Preferences")) ? "hi" : "bye"} */}
                            {/* {val.title === ("Set Preferences") ? null : <div id="icon">{val.icon}</div>}
                            {val.title === ("Set Preferences") ? null : <div id='title'> {val.title}</div>} */}
                            <div id="icon">{val.icon}</div>
                            <div id='title'> {val.title}</div>

                        </li>
                    )
                })}
            </ul>
        </div >
    )
}

export default StudentSidebar;