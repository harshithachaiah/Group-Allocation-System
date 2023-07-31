import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StreetviewRoundedIcon from '@material-ui/icons/StreetviewRounded';
import PriorityHighRoundedIcon from '@material-ui/icons/PriorityHighRounded';
import MessageRoundedIcon from '@material-ui/icons/MessageRounded';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AssignmentIcon from '@mui/icons-material/Assignment';
import React from 'react';

export const StudentSidebarData = [

    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/studentdashboard"
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        link: "/user-details"
    },
    {
        title: "Topics",
        icon: <StreetviewRoundedIcon />,
        link: "/studentviewtopic"
    },
    {
        title: "Preferences",
        icon: <PriorityHighRoundedIcon />,
        link: "/setpreferences"
    },
    {
        title: "Suggest Topic",
        icon: <MessageRoundedIcon />,
        link: "/suggesttopic"
    },
    {
        title: "My Suggestion",
        icon: <AssignmentIcon />,
        link: "/mysuggestion"
    },
    {
        title: "Groups",
        icon: <Diversity3Icon />,
        link: "/studentgroup"
    },

    {
        title: "Logout",
        icon: < ExitToAppIcon />,
        link: "/logout"
    }

];

