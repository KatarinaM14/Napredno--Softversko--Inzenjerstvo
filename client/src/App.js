import React, {useContext, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import Home from './components/Pages/Home/Home';
import { useDispatch } from 'react-redux';
import { getPosts} from './actions/posts';
import Register from './components/Pages/Register/Register';
import LogIn from './components/Pages/LogIn/LogIn';
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Leftbar from './components/Leftbar/Leftbar';
import Rightbar from './components/Rightbar/Rightbar';
import Profile from './components/Profile/Profile';
import "./style.scss";
import { DarkModeContext } from './context/darkModeContext';
import Moments from './components/Pages/Moments/Moments';
import AddPost from './components/Pages/AddPost/AddPost';
import AddStory from './components/Pages/AddStory/AddStory';
import Chat from './components/Pages/Messages/Chat';
import NewChat from './components/Pages/Messages/NewChat';
import { HubConnectionBuilder,HubConnection } from '@microsoft/signalr';
import { registerUser } from './actions/chat';
import Ponovo from './components/Pages/Messages/NewChat';
import { useState } from 'react';
import AppBarr from './components/Navbar/AppBar';

const App = () => {

  const currentUser = JSON.parse(localStorage.getItem("profile"))?.user;

  console.log(currentUser);
  const dispatch = useDispatch();
  const [connection, setConnection] = useState();

  useEffect(() => {
    dispatch(registerUser(currentUser));

    joinRoom();
  
  },[]);
  const joinRoom = async () => {
    try {    
      const connection = new HubConnectionBuilder()
      .withUrl('https://localhost:44318/hubs/chat')
      .withAutomaticReconnect()
      .build();

      setConnection(connection);

      console.log(connection)

      console.log(connection?.connectionId)

        await connection?.start().catch(console.error());
        
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
   
    if(currentUser)
    {
      connection?.on('UserConnected', () =>{
        console.log('the server has called here')
        addUserConnection();  
      })

    }
  
  },[connection, currentUser]);

  const addUserConnection = async () => {
    console.log("add user connection")
    console.log(connection)
    console.log(connection?.invoke)
    console.log(currentUser)
    console.log(currentUser?.id)
    await connection?.invoke("AddUserConnection", currentUser?.id).catch(console.error());
}

  const { darkMode } = useContext(DarkModeContext);

  console.log(darkMode);

  const Layout = () => {
    return(
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <AppBarr  key={currentUser?.id} connection={connection}/>
        <div style={{display:"flex"}}>
          <Leftbar key={currentUser?.id} mobileSize={false}/>
          <div style={{flex:6}}>
            <Home  key={currentUser?.id} connection={connection}/>
          </div>
          <Rightbar key={currentUser?.id} connection={connection} mobileSize={false} />
        </div>
      </div>
    );
  }
  const Layout1 = () => {
    return(
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <AppBarr connection={connection}/>
        <div style={{display:"flex"}}>
          <div style={{flex:6}}>
            <Profile connection={connection}  key={currentUser?.id}/>
          </div>
        </div>
      </div>
    );
  }
  const Layout2 = () => {
    return(
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <AppBarr connection={connection}/>
        <div style={{display:"flex"}}>
          <div style={{flex:6}}>
            <Moments connection={connection} mode={darkMode} key={currentUser?.id}/>
          </div>
        </div>
      </div>
    );
  }
  const Layout3 = () => {
    return(
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <AppBarr connection={connection}/>
          <AddPost/>
      </div>
    );
  }
  const Layout4 = () => {
    return(
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <AppBarr connection={connection}/>
        <div style={{display:"flex"}}>
          <div style={{flex:6}}>
            <AddStory/>
          </div>
        </div>
      </div>
    );
  }
  const Layout5 = () => {
    return(
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <AppBarr connection={connection}/>
        <div style={{display:"flex"}}>
          <div style={{display:"flex"}}>
            <NewChat connection={connection}  mode={darkMode}/>
          </div>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({children}) => {
    if(!currentUser){
      return <Navigate to="/login"/>;
    }
    return children;
  }

  return (
    <>
      <Router>
        <Routes>    
          <Route path='/' exact element={<Register/>}/>
          <Route path='/register' exact element={ <Register/>}/>
          <Route path='/login' exact element={ <LogIn/>}/>
          <Route path='/moments' exact element={<ProtectedRoute><Layout2/></ProtectedRoute>}/>
          <Route path='/' exact element={ <Navigate replace to="/login"/>}/>
          <Route path='/home' exact element={<ProtectedRoute><Layout/></ProtectedRoute>}/>
          <Route path='/profile' exact element={<ProtectedRoute><Layout1/></ProtectedRoute>}/>
          <Route path='/addPost' exact element={<ProtectedRoute><Layout3/></ProtectedRoute>}/>
          <Route path='/addStory' exact element={<ProtectedRoute><Layout4/></ProtectedRoute>}/>
          <Route path='/chat' exact element={<ProtectedRoute><Layout5/></ProtectedRoute>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
