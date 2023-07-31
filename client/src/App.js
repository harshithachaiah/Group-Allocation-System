
import './App.css';
import React from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserDetails from './components/UserDetails';
import Sidebar from './components/Sidebar';
import AddTopic from './components/AddTopic';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import ViewStudentSupervisor from './components/ViewStudentSupervisor';
import AdminHomepage from './components/AdminHomepage';
import Logout from './components/Logout';
import AddUser from './components/AddUser';
import StudentSidebar from './components/StudentSidebar';
import SupervisorSidebar from './components/SupervisorSidebar';
import StudentViewTopic from './components/StudentViewTopic';
import SupervisorViewTopic from './components/SupervisorViewTopic';
import AdminViewTopic from './components/AdminViewTopic';
import AdminDashboard from './components/AdminDashboard';
import EditProfile from './components/EditProfile';
import Announcement from './components/Announcement';
import SupervisorDashboard from './components/SupervisorDashboard';
import StudentDashboard from './components/StudentDashboard';
import SetPreferences from './components/SetPreferences';
import SupervisorSetPreferences from './components/SupervisorSetPreference';
import AdminAddTopic from './components/AdminAddTopic';
import AdminViewPreferences from './components/AdminViewPreferences';
import AllocateGroup from './components/AllocateGroup';
import Timeline from './components/Timeline';
import Resetpassword from './components/Resetpassword';
import SupervisorViewGroup from './components/SupervisorViewGroup';
import StudentViewGroup from './components/StudentViewGroup';
import StudentSuggestTopic from './components/StudentSuggestTopic';
import WelcomePage from './components/WelcomePage';
import StudMySuggestion from './components/StudMySuggestion';
import uniLogo from './images/universitylogo.jpeg'






function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");



  return (
    <Router>


      <nav className="navbar navbar-expand-lg navbar-light bg-color-app">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/welcomepage">Group Allocation System</a>
          <img src={uniLogo} alt="University" className="universityLogo-image" />


          {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/sign-in">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/sign-up">Sign Up</a>
               
          </li>

        </ul>

      </div> */}

        </div>
      </nav>

      <Routes>


        <Route exact path="/" element={isLoggedIn === "true" ? <UserDetails /> : <WelcomePage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/viewstudstaff/:type" element={<ViewStudentSupervisor />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/studentsidebar" element={<StudentSidebar />} />
        <Route path="/supervisorsidebar" element={<SupervisorSidebar />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/adduser' element={<AddUser />} />
        <Route path='/addtopic' element={<AddTopic />} />
        <Route path='/studentviewtopic' element={<StudentViewTopic />} />
        <Route path='/supervisorviewtopic' element={<SupervisorViewTopic />} />
        <Route path='/adminviewtopic' element={<AdminViewTopic />} />
        <Route path='/admindashboard' element={<AdminDashboard />} />
        <Route path='/editprofile' element={<EditProfile />} />
        <Route path='/announcement' element={<Announcement />} />
        <Route path='/studentdashboard' element={<StudentDashboard />} />
        <Route path='/supervisordashboard' element={<SupervisorDashboard />} />
        <Route path='/setpreferences' element={<SetPreferences />} />
        <Route path='/supervisorsetpreferences' element={<SupervisorSetPreferences />} />
        <Route path='/adminaddtopic' element={<AdminAddTopic />} />
        <Route path='/adminviewpreference' element={<AdminViewPreferences />} />
        <Route path='/allocategroup' element={<AllocateGroup />} />
        <Route path='/timeline' element={<Timeline />} />
        <Route path='/reset-password' element={<Resetpassword />} />
        <Route path='/supervisorgroup' element={<SupervisorViewGroup />} />
        <Route path='/studentgroup' element={<StudentViewGroup />} />
        <Route path='/suggesttopic' element={<StudentSuggestTopic />} />
        <Route path='/welcomepage' element={<WelcomePage />} />
        <Route path='/mysuggestion' element={<StudMySuggestion />} />







      </Routes>
    </Router>
  );
}
export default App;
