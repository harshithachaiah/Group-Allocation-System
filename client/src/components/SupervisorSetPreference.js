import React from 'react'

import { useState, useEffect, useRef } from 'react';
import SupervisorSidebar from './SupervisorSidebar';






const SupervisorSetPreferences = () => {
    const [data, setData] = useState([])
    const [userData, setuserData] = useState("")



    const [preference1, setPreference1] = useState("");
    const [preference2, setPreference2] = useState("");
    const [preference3, setPreference3] = useState("");


    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");
    const [id3, setId3] = useState("");


    const [pref1, setPref1] = useState("");
    const [pref2, setPref2] = useState("");
    const [pref3, setPref3] = useState("");

    const [supervisorprefernce, setsupervisorprefernce] = useState(false)








    useEffect(() => {

        getTopics();
        getUserDetails();
        getTimeline();




    }, [])

    function getUserDetails() {
        fetch("http://localhost:4000/user/data", {
            method: "POST",
            crossDomainn: true,
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
                if (!data.data.preference1) {


                }
                else {
                    setPref1(data.data.preference1.preference);
                    setPref2(data.data.preference2.preference)
                    setPref3(data.data.preference3.preference)


                }


                if (data.data === "token expired") {
                    alert("Token expired Login again")
                    window.localStorage.clear();
                    window.location.href = "/sign-in"
                }



            })

    }

    function getTopics() {
        fetch("http://localhost:4000/supervisor/getpreftopics", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Data");
                setData(data.data)


            })

    }


    // function getSupervisorPreference() {
    //     fetch("http://localhost:4000/supervisor/getsupervisorpreference", {
    //         method: "POST",
    //         crossDomainn: true,
    //         headers: {
    //             "Content-Type": "application/json",
    //             Accept: "application/json",
    //             "Access-Control-Allow-Origin": "*"
    //         },
    //         body: JSON.stringify({
    //             token: window.localStorage.getItem("token"),
    //         }),
    //     }).then((res) => res.json())
    //         .then((data) => {


    //             setPref1(data.preference1);
    //             setPref2(data.preference2)
    //             setPref3(data.preference3)




    //             if (data.data === "token expired") {
    //                 alert("Token expired Login again")
    //                 window.localStorage.clear();
    //                 window.location.href = "/sign-in"
    //             }



    //         })

    // }

    function getTimeline() {
        fetch("http://localhost:4000/admin/gettimeline", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Timeline");
                setsupervisorprefernce(data.data.setsupervisorprefernce)



            })

    }






    const save = () => {




        fetch("http://localhost:4000/supervisor/savepreference", {
            method: "PATCH",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                id: userData._id,
                preference1: { id: id1, preference: preference1 },
                preference2: { id: id2, preference: preference2 },
                preference3: { id: id3, preference: preference3 },



            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                console.log(data.data);
                alert(data.data);
            })


    }

    function topicsPage() {
        window.location.href = "/supervisorviewtopic"

    }

    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange1 = (id, topic) => {
        console.log(id, topic);

        //console.log(userData.preference1[1]);
        setPreference1(topic);
        setId1(id);
    }
    const handleOptionChange2 = (id, topic) => {
        console.log(id, topic);
        setPreference2(topic);
        setId2(id);
    }
    const handleOptionChange3 = (id, topic) => {
        console.log(id, topic);
        setPreference3(topic);
        setId3(id);
    }




    // const [selectedPreferences, setSelectedPreferences] = useState({});

    // const preferences = ["Preference 1", "Preference 2", "Preference 3", "Preference 4"];
    // const handlePreferenceSelect = (topicId, preference) => {
    //     setSelectedPreferences(prevState => ({
    //         ...prevState,
    //         [topicId]: preference
    //     }));
    // };

    // const isPreferenceDisabled = (topicId, preference) => {
    //     return selectedPreferences[topicId] && selectedPreferences[topicId] !== preference;
    // };



    const test = [{ id: "1", name: "topic1" }, { id: "2", name: "topic2" }, { id: "3", name: "topic3" }]
    if (!supervisorprefernce) {
        return (

            <div className='app'>
                <div className="col-2 p-0">
                    <SupervisorSidebar />
                </div>


                <div className="col-7 m-5">

                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Notification</h5>
                            <h6 className="card-subtitle mb-2 text-muted">This Page is currently unavailable</h6>

                        </div>
                    </div>
                </div>
            </div>
        )


    }
    return (

        <div className='app'>

            <div className="col-12 p-0">
                {pref1 === "" || pref1 === null || pref1 === undefined ? null :
                    <div>

                        <div><label>Preferences</label></div>

                        <table className="table table-sm">
                            <tbody>
                                <tr>
                                    <td>Preference 1</td>
                                    <td>Preference 2</td>
                                    <td>Preference 3</td>

                                </tr>
                                <tr>
                                    {/* {test.map(post => (
<td>{post.id}</td>)
)} */}
                                    <td>{pref1}</td>
                                    <td>{pref2}</td>
                                    <td>{pref3} </td>


                                </tr>

                            </tbody>
                        </table>

                    </div>
                }


                <div><label>List of Topics</label></div>
                <form onSubmit={save}>
                    <table className="table table-sm">
                        <tbody>
                            <tr>
                                <th className="table-active">Topics</th>
                                <th className="table-active">Description</th>
                                <th className="table-active"></th>
                                <th className="table-active"></th>

                                <th className="table-active">Preferences</th>
                                <th className="table-active"></th>
                            </tr>
                            {data.map(m => (
                                <tr key={m._id}>
                                    <td>{m.title} </td>
                                    <td>{m.description} </td>
                                    <td >

                                        {/* {preferences.map((preference) => (
                                            <td key={preference}>
                                                <input
                                                    type="radio"
                                                    name="test"
                                                    value={preference}
                                                    checked={selectedPreferences[m._id] === preference}
                                                    onChange={() => handlePreferenceSelect(m._id, preference)}
                                                    disabled={isPreferenceDisabled(m._id, preference)}
                                                />
                                            </td>
                                        ))} */}



                                        <input
                                            type="radio"
                                            className='m-2'
                                            name="Preference1"
                                            value="Preference 1"
                                            required
                                            onChange={(e) => handleOptionChange1(m._id, m.title)}
                                        // onChange={(e) => setUserType(e.target.value)}
                                        />{" "}

                                        Preference 1
                                    </td>

                                    <td>
                                        <input
                                            className='m-2'
                                            type="radio"
                                            name="Preference2"
                                            required
                                            value="Preference 2"
                                            onChange={(e) => handleOptionChange2(m._id, m.title)}
                                        // onChange={(e) => setUserType(e.target.value)}
                                        />{" "}
                                        Preference 2
                                    </td>
                                    <td>
                                        <input

                                            className='m-2'
                                            type="radio"
                                            name="Preference3"
                                            required
                                            value="Preference 3"
                                            onChange={(e) => handleOptionChange3(m._id, m.title)}
                                        // onChange={(e) => setUserType(e.target.value)}
                                        />{" "}
                                        Preference 3
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>





                    <div className="d-flex justify-content-center" >

                        <button type='submit' className="btn btn-success" >Save</button>

                    </div>
                </form>
                <button className="btn btn-primary" onClick={topicsPage}>Go Back</button>

            </div>




        </div >

    )
}

export default SupervisorSetPreferences
