import React, { useEffect,useState } from "react";
import "./rightbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUsersForFollow, followUser } from "../../actions/users";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { getUsersById } from "../../actions/users";

const Rightbar = ({connection, mobileSize}) => {

    const currentUser = JSON.parse(localStorage.getItem("profile"));
    const {conversations} = useSelector(state=>state.chat);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getUsersForFollow(currentUser.user.id));
    },[]);

    useEffect(() => {
        onlineFriends();
      }, [])

      const onlineFriends = async () => {
        console.log("online friends")
        console.log(connection)
        console.log(connection?.invoke)
        console.log(currentUser)
        console.log(currentUser.id)
        if(connection && connection._connectionState ==="Connected")
        {
            await connection?.invoke("DisplayOnlineUsers").catch(console.error());
        }
    }
    useEffect(() => {
        connection?.on('OnlineUsers', (onlineUsers) =>{
          console.log('online users')
          setOnlineUsers(onlineUsers);
    
            dispatch(getUsersById(onlineUsers));
        })
      
    },[]);

    const {usersToFollow} = useSelector(state=>state.auth);

    const follow = async (userId, e) => {
        //e.preventDefault();
  
        console.log(userId)
        dispatch(followUser(currentUser.user, userId));
      };

    const handleClick = (user) => {
   
        navigate("/profile", {state: {u : user}});  
    }

    return(
        <div className={ mobileSize ? "mobileRightBar" : "rightBar"}>
            <div className={ mobileSize ? "mobileContainer" : "container"}>
                <div className={ mobileSize ? "mobileItem" : "item"}>
                    <span>Suggestions for you</span>
                    {usersToFollow.map(user => (
                        <div className={ mobileSize ? "mobileUser" : "user"}>
                         <div className={ mobileSize ? "mobileUserInfo" : "userInfo"} onClick={()=>handleClick(user)}>
                             <img src={user.profileImg} alt=""/>
                             <span>{user.firstName} {user.lastName}</span>
                         </div>
                         <div className={ mobileSize ? "mobileButtons" : "buttons"}>
                             <Button style={{ backgroundColor: '#975F9B'}} onClick={()=>follow(user.id)}>
                                follow
                            </Button> 
                         </div>
                     </div>
                    ))}
                </div>
                <div className={ mobileSize ? "mobileItem" : "item"}>
                    <span>Online friends</span>
                    {(conversations)&&conversations?.map((u)=>(
            (currentUser.user.id!==u.id)&&(
                                    <div className={ mobileSize ? "mobileUser" : "user"}>
                                        <div className={ mobileSize ? "mobileUserInfo" : "userInfo"}>
                                            <img src={u.profileImg} alt=""/>
                                            <div className={ mobileSize ? "mobileOnline" : "online"}/>
                                                <span>{u.firstName} {u.lastName}</span> 
                                        </div>
                                    </div>)
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Rightbar;