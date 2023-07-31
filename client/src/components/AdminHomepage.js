import React from 'react'

import Sidebar from './Sidebar';







export default function AdminHomepage({ userData }) {
    ;

    const editProfile = () => {

        window.location.href = "./editprofile"

    }

    return (
        <div className='app'>
            <div className="col-2 p-0">
                <Sidebar />
            </div>
            <div className='col-10 p-0 m-2'>
                <div className="d-flex flex-column align-items-center text-center">
                    <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="Admin" className="rounded-circle p-1 bg-primary" width="110" />
                    <div className="mt-3">
                        <h4>{userData.firstName} {userData.surName}</h4>
                        <div style={{ display: 'inline' }}> Role<p className="text-secondary mb-1">{userData.userType}</p></div>
                        Email<p className="text-muted font-size-sm">{userData.email}</p>

                        <button onClick={editProfile} className="btn btn-primary">Edit Profile</button>
                    </div>


                </div>
            </div>

        </div>
    )
}
