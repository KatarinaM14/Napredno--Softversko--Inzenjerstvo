import React, { useState }  from "react";
//import videoGive from './assets/give-flagship-video.mp4'
//import './Home.css'
//import useStyles from "./style";
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
    //const mode = JSON.parse(localStorage.getItem("darkMode"));
    //const [modeColor, setModeColor] = useState("#f6f3f3");

    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(()=>{
        dispatch(getPostsOfNotFollowingUsers(currentUser.user.id));
    },[]);

    const {posts, isLoading} = useSelector(state=>state.posts);

    console.log(posts);
    console.log(isLoading);
    console.log(currentUser.user.id);
    console.log(mode)
    //console.log(modeColor)
    if(mode===true){
      //setModeColor("#333333")
    }
   //// const classes = useStyles();
    // return (
    //     isLoading ? 
    //     (<CircularProgress/>) : (
    //       <Grid container className={classes.root}>
    //       <Grid container item xs={12} alignItems="strech" spacing={1} >
    //           {posts.map((post) =>(
    //               <Grid key={post.id} item lg={4} md={8} display={"flex"} className={classes.grid} width={"100%"}>
    //                   <Moment post={post} />
    //               </Grid>
    //           ))}
    //       </Grid>
    //   </Grid>
    //   )
    //);

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
            //   <ImageListItem key={item.img}>
            //     <img
            //       src={`${item.img}?w=248&fit=crop&auto=format`}
            //       srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            //       alt={item.title}
            //       loading="lazy"
            //     />
            //     <ImageListItemBar position="below" title={item.author} />
            //   </ImageListItem>
            ))}
          </ImageList>
        </Box>)
      );
}

export default Moments;