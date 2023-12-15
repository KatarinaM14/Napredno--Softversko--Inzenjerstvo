import './conversation.css';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FaceIcon from '@mui/icons-material/Face';
import { useEffect, useState, useRef } from 'react';
import { getOneUser } from '../../../../actions/auth.js';
import { allMessages } from '../../../../actions/chat.js';
import { useSelector, useDispatch } from 'react-redux';
import * as api from '../../../../api/index.js';

export default function Conversation({conversation, currentUser,mode}) {

  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    console.log(conversation)
    console.log(conversation?.members)
    console.log(currentUser)
      const friendId = conversation?.members?.find((m) => m.id !== currentUser.id);
      const fun = async () => {
        console.log(friendId)
        if(friendId)
        {
            const res = await api.fetchUser(friendId.id);
            setUser(res.data);
        }
      }
      fun();
  }, [currentUser]);
  console.log(user)

  useEffect(() => {
    if(currentUser.id === conversation.id)
      setActive(!active);
    else
      setActive(false);
  }, [currentUser]) 

  const setActiveConv = () => {
    console.log("set active")
  };

  return (
    <ListItem button style={{padding: "5px 5px 5px 5px", marginBottom: "0.5rem", width: "95%", maxWidth: "95%", borderRadius: "65px 65px 65px 65px", backgroundColor:mode?"#333333":"white"}} onClick={setActiveConv} >
        <ListItemIcon>
          <Avatar alt="" src={user.profileImg ? user.profileImg  : <FaceIcon />} style={{borderRadius: "60px 60px 60px 60px / 50px 50px 50px 50px", border: "2px solid goldenrod"}} />
        </ListItemIcon>
        <ListItemText primary={user.username} style={{color:mode?"white":"black" }}/>
    </ListItem>
  )
}
