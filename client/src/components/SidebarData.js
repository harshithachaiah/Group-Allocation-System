import HomeIcon from '@material-ui/icons/Home';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SchoolIcon from '@material-ui/icons/School';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import StreetviewRoundedIcon from '@material-ui/icons/StreetviewRounded';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import MessageRoundedIcon from '@material-ui/icons/MessageRounded';
import PreviewIcon from '@mui/icons-material/Preview';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';

import React from 'react';


export const SidebarData = [


    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/admindashboard"
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        link: "/user-details"
    },
    {
        title: "Students",
        icon: <SchoolIcon />,
        link: "/viewstudstaff/students"
    },
    {
        title: "Supervisors",
        icon: <SupervisedUserCircleIcon />,
        link: "/viewstudstaff/supervisors"
    },
    {
        title: "Anouncement",
        icon: <NotificationAddIcon />,
        link: "/announcement"
    },
    {
        title: "Topics",
        icon: <StreetviewRoundedIcon />,
        link: "/adminviewtopic"
    },
    // {
    //     title: "Add Topic",
    //     icon: <MessageRoundedIcon />,
    //     link: "/adminaddtopic"
    // },

    {
        title: "View Preferences",
        icon: <PreviewIcon />,
        link: "/adminviewpreference"
    },
    {
        title: "Timeline",
        icon: <CalendarMonthIcon />,
        link: "/timeline"
    },
    {
        title: "Allocate Group",
        icon: <RunningWithErrorsIcon />,
        link: "/allocategroup"
    },
    {
        title: "Register User",
        icon: <PersonAddIcon />,
        link: "/adduser"
    },
    {
        title: "Logout",
        icon: < ExitToAppIcon />,
        link: "/logout"
    }

];

