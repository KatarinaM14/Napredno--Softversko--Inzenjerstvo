import "./usermessage.css";
import { Grid, Avatar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { getOneUser } from '../../../../actions/auth.js'
import { useEffect } from "react";
import { getUser } from "../../../../actions/auth";

export default function UserMessage({ mine, message, friend }) {

  const dispatch = useDispatch();

  const currentUser = JSON.parse(localStorage.getItem("profile")).user;

  const { isLoadnig, authData, user } = useSelector(state => state.auth); 
  console.log(mine)
  console.log(message)
  console.log(friend)
  console.log(currentUser)

  return (
    <Grid className={`userMessage ${(message?.sender?.id === currentUser?.id) ? "mineMessage" : "friendMessage"}`}>
      <Grid className="messageText" style={{wordWrap: ""}}>{message.message}</Grid>
      <Grid className="userContainer">
        <Avatar variant="square" className="chatUserImg" alt="" src={(message?.sender?.id === currentUser?.id) ? currentUser?.profileImg : message?.sender?.profileImg} style={{borderRadius: "60px 60px 60px 60px / 50px 50px 50px 50px"}}/>
        <Typography className="chatUsername" variant="h6" component="h6" style={{fontSize: "10px"}}>
          {(message?.sender?.id === currentUser?.id) ? "You" : message?.sender?.username}
        </Typography>
      </Grid>
    </Grid>
  );
}
