import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Link, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Item from "./style.js"
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { useState } from "react";
import {useDispatch} from 'react-redux';
import { createPost } from '../../../actions/posts.js';
import FileBase from 'react-file-base64';
import { createStory } from '../../../actions/stories.js';
import "./addStory.css"
import { screenshot} from "../../../assets/screenshot.png"

const AddStory = () => {
    const currentUser = JSON.parse(localStorage.getItem("profile"))
    const navigate = useNavigate();
    const[newStory,setNewStory]=useState(
        {
         description: "",
         user: currentUser.user,
         image: '',
         location: ''
        }
    );
    const dispatch=useDispatch();

    const clear =() =>{
        setNewStory({description: "", image: '', location: ''});
      }

      
      const handleSubmit=async (e) =>{
        e.preventDefault();
        dispatch(createStory(newStory));
        clear();
        
      }

    return(
        // <React.Fragment>
        // <CssBaseline />
        // <Container maxWidth="sm" direction="column">
          <Box className="BoxAddStory" sx={{display:"flex",  height: '100vh', width:"100vw" ,justifyContent:"center", alignSelf:"center"}}>
           <Grid container className='addStoryMainGdrid'  sx={{display:"flex", height: '100%', width: '40%', alignItems: "center"}} xs={9} sm={5}>
              <Grid container className='addStoryForm' direction={"column"} height={"500px"} justifyContent={"space-around"} sx={{display:"flex", backgroundColor:"#3A739E" }}>
                  <Grid  sx={{display:"flex", justifyContent:"center"  }} >
                  {/* <Item >Add story</Item> */}
                    <div className='addStoryHeader'>
                      Add story
                    </div>
                  </Grid>
                  <Grid  item sx={{display:"flex", height:"50%", flexDirection:"column", justifyContent:"space-around"}}  >
                  <Item  item>
                  <TextField id="outlined-basic" label="Description" fullWidth variant="outlined"  onChange={(e)=>setNewStory({...newStory,description:e.target.value})}/>
                  </Item>
                  <Item >
                  <TextField id="outlined-basic" label="Location" fullWidth variant="outlined" onChange={(e)=>setNewStory({...newStory,location:e.target.value})}/>
                  </Item>
                  {/* <Item item> */}
                  <div style={{alignSelf:"center"}}>
                  {/* <TextField id="outlined-basic" label="Image" fullWidth variant="outlined" onChange={(e)=>setNewPost({...newPost,image:e.target.value})}/> */}
                    <FileBase type="file" multiple={false} onDone={({base64})=>setNewStory({...newStory,image:base64})}/>
                  {/* </Item> */}
                  </div>
                  </Grid>
                  <Grid item sx={{display: "flex", justifyContent:"center"}}>
                  {/* <Item> */}
                  <Button  className='addStorySaveButton' style={{color:"#3A739E", backgroundColor:"white"}}  startIcon={<SaveIcon style={{color:"#3A739E"}}/>} onClick={handleSubmit}>
                      Save
                  </Button>
                  {/* </Item> */}
                  </Grid>
              </Grid>

           </Grid>
          </Box>
      //   </Container>
      // </React.Fragment>
    );
}

export default AddStory;