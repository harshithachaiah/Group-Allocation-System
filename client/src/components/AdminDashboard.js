import React from 'react'
import Sidebar from './Sidebar'

const AdminDashboard = () => {
    return (
        <div className='app'>
            <div className="col-2 p-0">
                <Sidebar></Sidebar>
            </div>
            <div className="col-9 m-5">
                <h4>Welcome to Personal and Group Skills module (CO7210) Group allocation System.</h4>
                <div className="card" >
                    <div className="card-body">
                        <h5 className="card-title">Notification</h5>
                        <h6 className="card-subtitle mb-2 text-muted">Application usage</h6>
                        <p className="card-text">The web application is designed to facilitate the allocation of students to supervisors and topics for the Personal and Group Skills module (CO7210) </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdminDashboard
