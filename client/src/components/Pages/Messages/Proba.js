//import { List, IconButton, TextField, Container, Box, Grid, CircularProgress, Dialog, Typography, Button} from '@material-ui/core';
//import AddCircleIcon from '@material-ui/icons/AddCircle';
//import SendIcon from '@material-ui/icons/Send';
import React,{ useEffect, useRef } from 'react';
//import Conversation from './Conversation/Conversation.js';
import './chat.css';
//import UserMessage from './UserMessage/UserMessage.js';
import { useDispatch, useSelector } from "react-redux";
//import {allConversations} from '../../../actions/conversations.js';
import { createMessage, registerUser} from '../../../actions/chat.js'
//import { getConversation } from '../../../actions/conversations.js';
//import { getOneUser } from '../../../actions/auth.js';
import { useState } from 'react';
//import { getMessages } from '../../../api/index.js';
//import {FETCH_MESSAGES_FROM_CONVERSATION} from '../../../constants/actionTypes.js'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
//import {io} from 'socket.io-client';
import { HubConnection } from '@microsoft/signalr';
import signalRService from './SignalService';
//import signalRService from '../../../api';
import { getUsersById } from '../../../actions/users';
import Conversation from './Conversation/Conversation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import UserMessage from './UserMessage/UserMessage';
import Typography from '@mui/material/Typography';
import { getConversations,getMessagesInConversations } from '../../../actions/chat.js';

const Proba = ({connection}) => {

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
  //const [getConversations, setGetConversations] = useState();
  const [currentChat, setCurrentChat] = useState(null);
  //const [currentChatMessages, setCurrentChatMessages] = useState("");
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const {userConversations, chatMessages} = useSelector(state=>state.chat);
  const [currentMessage, setCurrentMessage] = useState();

  useEffect(() => {
    dispatch(getConversations(currentUser?.id));
  }, [onlineUsers])

  console.log(userConversations)
  console.log(chatMessages)

  useEffect(() => {
    dispatch(getMessagesInConversations(currentChat?.id));

  }, [currentChat, currentMessage])

  useEffect(() => {
//currentChat?.members?.find((m) => m.id !== currentUser.id)
console.log("INCLUDEEE")

setCurrentMessage(arrivalMessages)
console.log(arrivalMessages)
    const include = currentChat?.members?.find(u=>  u?.id === arrivalMessages?.sender)
    console.log(include)
    arrivalMessages && include &&
    dispatch(getMessagesInConversations(currentChat?.id));

  }, [arrivalMessages])

//   useEffect(() => {
   
//   }, [chatMessages]);
  
  useEffect(() => {
    messagesDiv.current?.scrollIntoView({behavior: 'smooth'});
    setMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
   
    connection?.on('UserConnected', () =>{
      console.log('the server has called here')
      addUserConnection();

      console.log(onlineUsers)
      //    console.log("add user connection")
      //    console.log(connection)
      //    console.log(connection?.invoke)
      //    console.log(currentUser)
      //    connection?.invoke("AddUserConnection", currentUser).catch(console.error());
    })
  
  },[connection]);

  useEffect(()=>{
    connection?.on('NewMessage', (sender, receiver, message ) =>{
      console.log(sender)
      console.log(receiver)
      console.log(message)
      console.log('arrival message')
     // const m = JSON.stringify(data);
     // console.log(m)
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
      dispatch(getMessagesInConversations(currentChat?.id));
      setPrivateMessageInitiated(true)
      //const modelRef = this.modelService.open(PrivateaChatComponent);
      //modelRef.componentInstance.toUser = newMessage.from;
    })
  
  },[connection]);

  useEffect(() => {
    connection?.on('NewPrivateMessage', (message, sender, receiver) =>{
      console.log('reveive private message')
      const include = currentChat?.members?.find(u=>  u?.id === sender)
      const m = {
        sender: sender,
        receiver: receiver,
        message: message
       }
       setArrivalMessages(m);
      include && setPrivateMessages([...privateMessages, m]) &&
      dispatch(getMessagesInConversations(currentChat?.id));
    })
  
  },[connection, arrivalMessages,currentMessage]);

  // useEffect(() => {
  //   console.log(privateMessages)
  //   console.log(currentChat)
  //   privateMessages && currentChat?.members?.includes(privateMessages.sender) &&
  //   set
  // }, [privateMessages])

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
  // const sendPrivateMessage = async  (toUser, content) => {
  //  // const message = {from: currentUser, to: toUser, content: content}

  //   if(!privateMessageInitiated){
  //     setPrivateMessageInitiated(true)

  //     await connection?.invoke("CeatePrivateChat", messages).then(() => {
  //       setPrivateMessages([...privateMessages, messages])
  //     }).catch(console.error());
  //   }else{
  //     await connection?.invoke("ReceivePrivateMessage", messages).catch(console.error());
  //   }

  // }
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
    //callReceiveMessage(message)
    if(!privateMessageInitiated){
        setPrivateMessageInitiated(true)


        console.log("CALLING CeatePrivateChat")
      
        await connection?.invoke("CeatePrivateChat", message?.message, message?.sender.id, message?.receiver.id)
        //.then(() => {
            //setPrivateMessages([...privateMessages, messages])
          //})
          .catch(console.error());
        }else{
            console.log("CALLING ReceivePrivateMessage")
            await connection?.invoke("ReceivePrivateMessage", message?.message, message?.sender.id, message?.receiver?.id).catch(console.error());
          }
          // sendMsg();
          dispatch(createMessage(message))
          //sendPrivateMessage(currentUser, messages)
          setNewMessages("");
         
  }

  const callReceiveMessage = async (message) => {
    console.log("CALL RECEIVE MESSAGE")
    console.log(message)

   // const deserializedMessage = JSON.parse(message);
    //console.log(deserializedMessage)
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
                  <Conversation key={c.id} conversation={c} currentUser={currentUser} />
                </div>
              ))
            }
              {/* {
              conversations?.map((c) => (
                <Conversation key={c.id} conversation={c} userId={currentUser} />
              ))
            } */}
          </List>
        </Grid>
      </Grid>
      <Grid className="chatWrapper">
        <Grid className="messageWrapper" >
          {chatMessages?.length !== 0 ? chatMessages?.map((m) => (
            <UserMessage key={m.id} mine={isMine(m?.sender?.id)} message={m} friend={m?.receiver} />
          )) : <Typography>Open conversation to view messages!</Typography>}
          <div ref={messagesDiv}></div>
        </Grid>
        <Grid className="inputWrapper">
          <TextField id="outlined-basic" label="Nova poruka:" variant="outlined" className='messageInput' size="small" value={newMessages} onChange={(e) => setNewMessages(e.target.value)} />
            <Button variant="contained" size="large" style={{backgroundColor: "#118A7E", color: "white"}} className="sendButton" onClick={handleSubmit}><SendRoundedIcon />
            </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Proba;