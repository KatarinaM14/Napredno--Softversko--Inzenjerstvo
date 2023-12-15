import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import "./navbar.scss";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useNavigate, useLocation } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import { Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import Leftbar from '../Leftbar/Leftbar';
import Rightbar from '../Rightbar/Rightbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import LogoutIcon from '@mui/icons-material/Logout';
//import decode from "jwt-decode";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AppBarr = ({connection}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [anchorElOnlineFriends, setAnchorElOnlineFriends] = React.useState(null);
  const [mobileMoreAnchorElOnlineFriends, setMobileMoreAnchorElOnlineFriends] = React.useState(null);

  const isMenuOpenOnlineFriends = Boolean(anchorElOnlineFriends);
  const isMobileMenuOpenOnlineFriends = Boolean(mobileMoreAnchorElOnlineFriends);

  const [anchorElAdd, setAnchorElAdd] = React.useState(null);
  const [mobileMoreAnchorElAdd, setMobileMoreAnchorElAdd] = React.useState(null);

  const isMenuOpenAdd = Boolean(anchorElAdd);
  const isMobileMenuOpenAdd = Boolean(mobileMoreAnchorElAdd);

  const [userLoggedOut, setUserLoggedOut] = useState(JSON.parse(localStorage.getItem("profile")).user);
  const currentUser = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();
  const location = useLocation();
  console.log(currentUser)
  console.log(currentUser.user)
  console.log(currentUser.user.firstName)
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const { toogle, darkMode } = useContext(DarkModeContext);
  const {authData, userCurrent} = useSelector(state=>state.auth);
  console.log(authData)

  const current = authData?.find(u => u.id === currentUser?.user.id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  useEffect(()=>{
     
  },[authData]);

  function logout(){
    localStorage.clear();
    navigate("/login");
    setUserLoggedOut(null);
    setAnchorEl(null);
}
 
  const handleClick = () => {
      navigate("/profile", {state: {u : currentUser?.user}});
    }

    const handleRead = () => {
      setNotifications([]);
      setOpen(false);
    };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpenOnlineFriends = (event) => {
    setAnchorElOnlineFriends(event.currentTarget);
  };

  const handleMobileMenuCloseOnlineFriends = () => {
    setMobileMoreAnchorElOnlineFriends(null);
  };
  
  const handleMenuCloseOnlineFriends = () => {
    setAnchorEl(null);
    handleMobileMenuCloseOnlineFriends();
  };

  const handleMobileMenuOpenOnlineFriends = (event) => {
    setMobileMoreAnchorElOnlineFriends(event.currentTarget);
  };
  
  const handleProfileMenuOpenAdd = (event) => {
    setAnchorElAdd(event.currentTarget);
  };

  const handleMobileMenuCloseAdd = () => {
    setMobileMoreAnchorElAdd(null);
  };
  

  const handleMenuCloseAdd = () => {
    setAnchorElAdd(null);
    handleMobileMenuCloseAdd();
  };

  const handleMobileMenuOpenAdd = (event) => {
    setMobileMoreAnchorElAdd(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu 
    sx={{maxWidth:"500px"}}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleClick} >
      <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="white"
        >
          <Avatar  src={current?.profileImg}/>
        </IconButton>
            <span>{current?.firstName} {current?.lastName}</span>
      </MenuItem>
      <MenuItem onClick={logout}>
      <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="white"
        >
          <LogoutIcon/>
        </IconButton>
            Log out
        </MenuItem>
      <MenuItem onClick={handleMenuClose}>
      <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="white"
        >
          <CloseIcon/>
        </IconButton>
            Close
        </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu 
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
        <MenuItem >
        <IconButton size="large"  color="black">
          <Badge color="error">
          <Link to="/home" style={{textDecoration:"none", color:"black"}} >

            <HomeOutlinedIcon style={{marginTop:"2px", color:"#7C567F"}}/>
            </Link>
          </Badge>
        </IconButton>
        <p style={{ color:"#7C567F"}}>Home</p>
      </MenuItem>
      <MenuItem >
        <IconButton size="large"  color="black">
          <Badge color="error">
            {darkMode ? <WbSunnyOutlinedIcon style={{marginTop:"2px", color:"#7C567F"}} onClick={toogle}/> : <DarkModeOutlinedIcon style={{marginTop:"2px", color:"#7C567F"}} onClick={toogle}/>} 
          </Badge>
        </IconButton>
        <p style={{ color:"#7C567F"}}>Mode</p>
      </MenuItem>
      <MenuItem >
        <IconButton size="large" color="white">
          <Badge color="error">
          <Link to="/chat" style={{textDecoration:"none"}}>
                
                <ChatIcon style={{ color:"#7C567F"}}/>
            </Link>
          </Badge>
        </IconButton>
        <p style={{ color:"#7C567F"}}>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleClick} >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="black"
        >
          <Avatar  src={current?.profileImg}/>
        </IconButton>
            <span style={{color: "#7C567F"}}>{current?.firstName} {current?.lastName}</span>
      </MenuItem>
      <MenuItem onClick={logout}>
      <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="white"
        >
          <LogoutIcon style={{ color:"#7C567F"}}/>
        </IconButton>
            <p style={{ color:"#7C567F"}}>Log out</p>
        </MenuItem>
    </Menu>
  );

   const mobileMenuIdOnlineFriends = 'secondary-search-account-menu-mobile';
   const renderMobileMenuOnlineFriends = (
     <Menu style={{color:"#975F9B" ,maxHeight: "100%", maxWidth:"100%", display:"flex"}}
       anchorEl={mobileMoreAnchorElOnlineFriends}
       anchorOrigin={{
        vertical: 'top',
         horizontal: 'right',
       }}
       id={mobileMenuIdOnlineFriends}
       keepMounted
       transformOrigin={{
         vertical: 'top',
        horizontal: 'right',
       }}
       open={isMobileMenuOpenOnlineFriends}
       onClose={handleMobileMenuCloseOnlineFriends}
     >
         <Rightbar key={currentUser?.id} connection={connection}  mobileSize={true}/>
     </Menu>
   );

   const mobileMenuIdAdd = 'secondary-search-account-menu-mobile';
   const renderMobileMenuAdd = (
     <Menu style={{color:"#975F9B", maxHeight: "100%", maxWidth:"100%", display:"flex"}}
       anchorEl={mobileMoreAnchorElAdd}
       anchorOrigin={{
        vertical: 'top',
         horizontal: 'right',
       }}
       id={mobileMenuIdAdd}
       keepMounted
       transformOrigin={{
         vertical: 'top',
        horizontal: 'right',
       }}
       open={isMobileMenuOpenAdd}
       onClose={handleMobileMenuCloseAdd}
     >
         <Leftbar key={currentUser?.id} connection={connection} mobileSize={true}/>
     </Menu>
   );

  return (
    <Box  sx={{ flexGrow: 1, zIndex: 999, position:"sticky", top:"0px" }}>
      <AppBar className="appbarr" style={{backgroundColor: "#975F9B", color: "white"}} position="static">
        <Toolbar>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, width:"15%", justifyContent:"space-around" }}>
          <Link to="/home" style={{textDecoration:"none"}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            color="black"
            
          >
                    <span style={{color:"white"}}>Moments</span>
          </Typography>
                </Link>
          <Link to="/home" style={{textDecoration:"none", color:"white"}} >

            <HomeOutlinedIcon style={{marginTop:"2px", color:"white", marginTop:"5px"}}/>
            </Link>
            {darkMode ? <WbSunnyOutlinedIcon style={{marginTop:"2px", marginTop:"5px"}} onClick={toogle}/> : <DarkModeOutlinedIcon style={{marginTop:"2px", marginTop:"5px"}} onClick={toogle}/>}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Link to="/chat" style={{textDecoration:"none"}}>
            <IconButton size="large" color="white">
              <Badge  color="error">   
                 <ChatIcon style={{color:"white", marginTop:"10px"}} />
              </Badge>
            </IconButton>
                </Link>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="white"
            >
              <Avatar src={current?.profileImg} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }} n>
          <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuIdAdd}
              aria-haspopup="true"
              onClick={handleMobileMenuOpenAdd}
              
            >
              <AddCircleIcon style={{color:"white"}}/>
            </IconButton>
            </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }} n>
          <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuIdOnlineFriends}
              aria-haspopup="true"
              onClick={handleMobileMenuOpenOnlineFriends}
              
            >
              <PeopleIcon style={{color:"white"}}/>
            </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }} n>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              
            >
              <MoreIcon style={{color:"white"}}/>
            </IconButton>
            </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenuAdd}
      {renderMobileMenuOnlineFriends}
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

export default AppBarr;