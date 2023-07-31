import React from 'react'
import SupervisorSidebar from './SupervisorSidebar';



export default function SupervisorHomepage({ userData }) {

    const editProfile = () => {

        window.location.href = "./editprofile"

    }

    return (
        <div className=' app'>

            <div className="col-2 p-0">
                <SupervisorSidebar />
            </div>
            <div className="col-8 p-0">
                <div className="d-flex flex-column align-items-center text-center m-5">
                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Supervisor" className="rounded-circle p-1 bg-primary" width="110" />
                    <div className="mt-3">
                        <h4>{userData.firstName} {userData.surName}</h4>
                        <p className="text-secondary mb-1">{userData.userType}</p>
                        Email<p className="text-muted font-size-sm">{userData.email}</p>



                        <button onClick={editProfile} className="btn btn-primary">Edit Profile</button>

                    </div>
                </div>
            </div>

        </div>
    )
}


