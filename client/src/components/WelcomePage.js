import React from 'react'
import universityImage from "../images/uni_of_leicester.jpeg"
import "./WelcomePage.css"
import { Link } from 'react-router-dom'

const WelcomePage = () => {
    return (
        <div className="welcome-page">

            <div className="image-container">
                <div className="overlay">
                    <h1 className="image-title">Welcome to Personal and Group Skill Module CO7210</h1>
                    <p className="image-description">This is a module that can be taken in either semester, depending on the choice of optional modules that each student makes. Students attend a series of seminars given by researchers from universities or companies followed by group discussions, some of which are moderated by a member of staff. Students also attend two workshops on skills that are particularly relevant to the module. Resources on other skills that are also high up on the value chain of any IT employer are made available on this Blackboard site.</p>
                </div>
                <img src={universityImage} alt="University" className="university-image" />
                <div className="image-buttons-container">
                    <Link to="/sign-in">
                        <button className="login-button">Login</button>
                    </Link>
                    <Link to="/sign-up">
                        <button className="register-button">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage
