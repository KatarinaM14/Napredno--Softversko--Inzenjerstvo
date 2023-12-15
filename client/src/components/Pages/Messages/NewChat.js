
import React,{ useEffect, useRef } from 'react';
import './chat.css';
import { useDispatch, useSelector } from "react-redux";
import { createMessage, registerUser} from '../../../actions/chat.js'
import { useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import { HubConnection } from '@microsoft/signalr';
import signalRService from './SignalService';
import { getUsersById } from '../../../actions/users';
import Conversation from './Conversation/Conversation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import UserMessage from './UserMessage/UserMessage';
import Typography from '@mui/material/Typography';
import { getConversations,getMessagesInConversations } from '../../../actions/chat.js';
import { useNavigate, useLocation } from "react-router-dom";

const NewChat = ({connection, mode}) => {

  const currentUser = JSON.parse(localStorage.getItem("profile")).user;
  const messagesDiv = useRef(null);
  const {conversations} = useSelector(state=>state.chat);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [sendMessages, setSendMessages] = useState([]);
  const [privateMessageInitiated, setPrivateMessageInitiated] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const {userConversations, chatMessages} = useSelector(state=>state.chat);
  const [currentMessage, setCurrentMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getConversations(currentUser?.id));
  }, [onlineUsers])

  console.log(userConversations)
  console.log(chatMessages)

  useEffect(() => {
    dispatch(getMessagesInConversations(currentChat?.id, navigate));
  }, [currentChat, arrivalMessages])
  
  useEffect(() => {
    messagesDiv.current?.scrollIntoView({behavior: 'smooth'});
    setMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
   
    connection?.on('UserConnected', () =>{
      console.log('the server has called here')
      addUserConnection();

      console.log(onlineUsers)
    })
  
  },[connection]);

  useEffect(()=>{
    connection?.on('NewMessage', (sender, receiver, message ) =>{
      console.log(sender)
      console.log(receiver)
      console.log(message)
      console.log('arrival message')
     const m = {
      sender: sender,
      receiver: receiver,
      message: message
     }
      setArrivalMessages(m);
    })
  },[arrivalMessages, connection])
 
  useEffect(() => {
    connection?.on('OnlineUsers', (onlineUsers) =>{
      console.log('online users')
      setOnlineUsers(onlineUsers);

        dispatch(getUsersById(onlineUsers));
    })
  
  },[onlineUsers,connection]);
  console.log(onlineUsers)
  useEffect(() => {
    connection?.on('OpenPrivateChat', (message, sender, receiver) =>{
      console.log('private chat')
      const include = currentChat?.members?.find(u=>  u?.id === sender)
      const m = {
        sender: sender,
        receiver: receiver,
        message: message
       }
      include && setPrivateMessages([...privateMessages, m]) &&
      dispatch(getMessagesInConversations(currentChat?.id, navigate));
      setPrivateMessageInitiated(true)
    })
  
  },[connection]);

  useEffect(() => {
    connection?.on('NewPrivateMessage', (message, sender, receiver) =>{
      console.log('reveive private message')
      const m = {
        sender: sender,
        receiver: receiver,
        message: message
       }
       setArrivalMessages(m);
    })
  
  },[connection]);

  useEffect(() => {
    connection?.on('ClosePrivateChat', () =>{
      console.log('close private chat')
      setPrivateMessageInitiated(false);
      setPrivateMessages([])
    })
  
  },[onlineUsers,connection]);

  console.log(connection)
  console.log(onlineUsers)
  console.log(conversations)
  
  const addUserConnection = async () => {
        console.log("add user connection")
        console.log(connection)
        console.log(connection?.invoke)
        console.log(currentUser)
        console.log(currentUser.id)
        await connection?.invoke("AddUserConnection", currentUser.id).catch(console.error());
  }

  const closePrivateChatMessage = async  (otherUser) =>{
        await connection?.invoke("RemovePrivateChat", currentUser, otherUser).catch(console.error());
  }

  const sendMessage = async  (toUser, content) => {
      const message = {from: currentUser, to: toUser, content: content}

      await connection?.invoke("ReceiveMessage", message).catch(console.error());
  }
    const isMine = (senderId) => {
      console.log(senderId)
      console.log(currentUser.id)
    if(senderId === currentUser.id)
      return true;
    return false;
  };

  console.log(currentChat)

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const message = {
      conversation: currentChat,
      sender: currentUser,
      receiver: currentChat?.members?.find((m) => m.id !== currentUser.id),
      message: newMessages
    }
    console.log(message)

    setCurrentMessage(message)

          dispatch(createMessage(message))
          await connection?.invoke("SendMessageToUser", 
          message?.message, message?.sender.id, message?.receiver?.id)
          .catch(console.error());
          setNewMessages("");  
  }

  const callReceiveMessage = async (message) => {
    console.log("CALL RECEIVE MESSAGE")
    console.log(message)

    await connection?.invoke('ReceiveMessage', message.sender.id, message.receiver.id, message.message).catch(console.error());
}
 
  return (
    <Grid className='messenger'>
      <Grid className="conversationWrapper">
        <Grid className="listWrapper">
          <List component="nav" aria-label="main mailbox folders" className="conversationsList" >
            {
              userConversations?.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation key={c.id} conversation={c} currentUser={currentUser} mode={mode} />
                </div>
              ))
            }
          </List>
        </Grid>
      </Grid>
      <Grid className="chatWrapper" >
        <Grid className="messageWrapper" style={{backgroundColor:mode?"#333333":"white" }}>
          {chatMessages?.length !== 0 ? chatMessages?.map((m) => (
            <UserMessage key={m.id} mine={isMine(m?.sender?.id)} message={m} friend={m?.receiver} />
          )) : <Typography style={{color:mode?"white":"black"}}>Start conversation</Typography>}
          <div ref={messagesDiv}></div>
        </Grid>
        <Grid className="inputWrapper">
          <TextField id="outlined-basic"  style={{backgroundColor:mode?"#333333":"white", color:mode?"white":"black" }} label="New message:" variant="outlined" className='messageInput' size="small" value={newMessages} onChange={(e) => setNewMessages(e.target.value)} />
            <Button variant="contained" size="large" style={{backgroundColor:mode?"#333333":"white", color: "#A471A8"}} className="sendButton" onClick={handleSubmit}><SendRoundedIcon />
            </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default NewChat;