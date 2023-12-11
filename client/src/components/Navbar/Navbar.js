import React, { useEffect, useState } from "react"; 
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
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
const Navbar = ({connection}) => {

    //const currentUser = localStorage.getItem("profile")

    const currentUser = JSON.parse(localStorage.getItem("profile"));
    const navigate = useNavigate();
    console.log(currentUser)
    console.log(currentUser.user)
    console.log(currentUser.user.firstName)
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const { toogle, darkMode } = useContext(DarkModeContext);
    //const {user, token} = useSelector(state => state.authData);
    //console.log(user)
    //console.log(token)
    const {authData, userCurrent} = useSelector(state=>state.auth);
    console.log(authData)

    const current = authData?.find(u => u.id === currentUser?.user.id);
    console.log(current)

    useEffect(()=>{
       
    },[authData]);

    useEffect(() => {
        connection?.on('ReceiveNotificationPostLiked', (senderId, receiverId, postId, username) =>{
          console.log('ReceiveNotificationPostLiked CALLED')
          console.log(senderId)
          console.log(receiverId)
          console.log(postId)
          console.log(connection)

          setNotifications((prev)=>[...prev, {senderId: senderId,
            receiverId: receiverId,
        postId: postId,
        username: username,
        type: "liked"}])
        })
    },[connection]);
    console.log(notifications)

    useEffect(() => {
        connection?.on('ReceiveNotificationPostCommented', (senderId, receiverId, postId, username) =>{
          console.log('ReceiveNotificationPostCommented CALLED')
          console.log(senderId)
          console.log(receiverId)
          console.log(postId)
          console.log(connection)

          setNotifications((prev)=>[...prev, {senderId: senderId,
            receiverId: receiverId,
        postId: postId,
        username: username,
        type: "commented"}])
        })
    },[connection]);
    console.log(notifications)

    useEffect(() => {
        connection?.on('ReceiveNotificationFollow', (senderId, receiverId, username) =>{
          console.log('ReceiveNotificationFollow CALLED')
          console.log(senderId)
          console.log(receiverId)
          console.log(connection)

          setNotifications((prev)=>[...prev, {senderId: senderId,
            receiverId: receiverId,
        username: username,
        type: "followed"}])
        })
    },[connection]);
    console.log(notifications)

    //const { darkMode } = useContext(DarkModeContext);
    const handleClick = () => {
   
        // if(user?.user._id == donationData?.creatorId)
        // {
        //    navigate("/userpage");
        // }
        // else{
          navigate("/profile", {state: {u : currentUser?.user}});
        //}
       
      }

      const displayNotification = (n) => {
        // let action;
    
        // if (type === 1) {
        //   action = "liked";
        // } else if (type === 2) {
        //   action = "commented";
        // } else {
        //   action = "shared";
        // }
        if (n.type === "followed")
        {
            return (
                <span className="notification">{`${n.username} started following you.`}</span>
              );
        }
        return (
          <span className="notification">{`${n.username} ${n.type} your post.`}</span>
        );
      };

      const handleRead = () => {
        setNotifications([]);
        setOpen(false);
      };

    return(
        <div className="navbar">
            <div className="leftNavbar">
                <Link to="/home" style={{textDecoration:"none"}}>
                    <span>Moments</span>
                </Link>
                <Link to="/home" style={{textDecoration:"none"}}>

                    <HomeOutlinedIcon/>
                </Link>
                    {darkMode ? <WbSunnyOutlinedIcon onClick={toogle}/> : <DarkModeOutlinedIcon onClick={toogle}/>}
                    <GridViewOutlinedIcon/>
                    <div className="search">
                        <SearchOutlinedIcon/>
                        <input type="text" placeholder="Search..."/>
                    </div>
            </div>
            <div className="rightNavbar">
                <PersonOutlinedIcon/>
                <Link to="/chat" style={{textDecoration:"none"}}>
                
                    <EmailOutlinedIcon/>
                </Link>
                <div className="iconImg" onClick={() => setOpen(!open)}>
                    <NotificationsOutlinedIcon/>
                   { notifications.length >0 &&
                        <div className="counter">{notifications.length}</div>}
                </div>
                {open && (
                    <div className="notifications">
                    {notifications.map((n) => displayNotification(n))}
                        <button className="nButton" onClick={handleRead}>
                            Mark as read
                        </button>
                    </div>
                )}
                <div className="user" onClick={handleClick}>
                    <img src={current?.profileImg} alt=""/>
                    <span>{current?.firstName} {current?.lastName}</span>
                </div>
            </div>
        </div>
    );
}

export default Navbar;