import React from 'react'
import "./Sidebar.css"
import { SidebarData } from './SidebarData'




function Sidebar() {






    return (
        <div className="sidebarapp" >

            <ul className='SideBarlist'>
                {/* <button onClick={toggleSidebar}>Toggle Sidebar</button> */}

                {
                    SidebarData.map((val, key) => {
                        return (
                            <li className="row" key={key} id={window.location.pathname === val.link ? "active" : ""} onClick={() => { window.location.pathname = val.link }}>

                                <div id="icon">{val.icon}</div><div id='title'> {val.title} </div>



                            </li>

                        )
                    })

                }

            </ul>
        </div>
    )
}

export default Sidebar;
