import React from 'react'
import "./Sidebar.css"
import { SupervisorSidebarData } from "./SupervisorSidebarData"




function SupervisorSidebar() {
    return (
        <div className="sidebarapp" >
            <ul className='SideBarlist'>
                {SupervisorSidebarData.map((val, key) => {
                    return (
                        <li className="row" key={key} id={window.location.pathname === val.link ? "active" : ""} onClick={() => { window.location.pathname = val.link }}>
                            <div id="icon">{val.icon}</div><div id='title'> {val.title}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SupervisorSidebar;