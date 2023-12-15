import React, { useState }  from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsOfNotFollowingUsers } from "../../../actions/posts";
import useStyles from "./styles.js";
import Grid from '@mui/material/Grid';
import { CircularProgress } from "@mui/material";
import Moment from "./Moment/Moment";
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import "./moments.scss"

const Moments=({connection, mode}) => {

    const currentUser = JSON.parse(localStorage.getItem("profile"));

    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(()=>{
        dispatch(getPostsOfNotFollowingUsers(currentUser.user.id));
    },[]);

    const {posts, isLoading} = useSelector(state=>state.posts);

    if(mode===true){
      //setModeColor("#333333")
    }

    return (
        isLoading ? 
         (<div style={{backgroundColor:mode?"black":"white" , minHeight:"100vh"}}>
           <CircularProgress/>
         </div>
         ) : 
        (<Box   sx={{ display:"flex",flexWrap:"wrap", width: "100%", height: "100%", className:"moments",  backgroundColor:mode?"black":"white" }} >
          <ImageList style={{overflowY:"hidden"}}  gap={5} sx={{className:"imageList" ,height:"100%" ,display:"flex",flexWrap:"wrap",  marginLeft: "2%"}} xs={12}>
            {posts.map((post) => (
                 <Moment post={post} />
            ))}
          </ImageList>
        </Box>)
      );
}

export default Moments;