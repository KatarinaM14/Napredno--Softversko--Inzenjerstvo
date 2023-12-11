import React from "react";
//import videoGive from './assets/give-flagship-video.mp4'
//import './Home.css'
//import useStyles from "./style";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPosts } from "../../../actions/posts";
import "./home.scss";
import Posts from "../../Posts/Posts";
import Stories from "../../Stories/Stories";

const Home=({connection}) => {
    const dispatch = useDispatch();

    useEffect(()=>{
        //dispatch(getPosts());
    
        const user1 = localStorage.getItem("profile")
        console.log(user1)
    
      },[dispatch]);
   //// const classes = useStyles();
    return (
        // <div className='contact'>
        <div className='home'>
            <div className="main">
                <div className="overlay"></div>
            {/* <video src={videoGive} autoPlay loop muted/> */}
            <div className="content">
              <Stories/>
              <Posts connection={connection}/>
            </div>
           </div>
        </div>
    );
}

export default Home;