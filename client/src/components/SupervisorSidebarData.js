import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StreetviewRoundedIcon from '@material-ui/icons/StreetviewRounded';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';
import MessageRoundedIcon from '@material-ui/icons/MessageRounded';
import PriorityHighRoundedIcon from '@material-ui/icons/PriorityHighRounded';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import React from 'react';

export const SupervisorSidebarData = [

    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/supervisordashboard"
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        link: "/user-details"
    },
    {
        title: "Topics",
        icon: <StreetviewRoundedIcon />,
        link: "/supervisorviewtopic"
    },
    // {
    //     title: "Topics by Students",
    //     icon: <SupervisorAccountRoundedIcon />,
    //     link: ""
    // },

    {
        title: "Publish Topic",
        icon: <MessageRoundedIcon />,
        link: "/addtopic"
    },
    {
        title: "Groups",
        icon: <Diversity3Icon />,
        link: "/supervisorgroup"
    },

    {
        title: "Logout",
        icon: < ExitToAppIcon />,
        link: "/logout"
    }

];

