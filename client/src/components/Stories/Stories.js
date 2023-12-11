import React, { useEffect, useState } from "react"; 
import "./stories.scss"
//import Post from "./Post/Post";
import { useDispatch, useSelector } from "react-redux";
import { getStoriesOfUserAndHisFollowings,getLatestStory, createStory } from "../../actions/stories";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

const Stories = () => {

    const currentUser = JSON.parse(localStorage.getItem("profile"));

    const [storyData, setStoryData] = useState({
        image: "",
        description: "",
        location: "",
        user: currentUser.user
      });

    const [open, setOpen] = React.useState(false);

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getStoriesOfUserAndHisFollowings(currentUser.user.id));
        dispatch(getLatestStory(currentUser.user.id));
    },[]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit =async (e) => {
        e.preventDefault();
  
        console.log(storyData)
        dispatch(createStory(storyData));
         
        setOpen(false);
      };

    // const stories = [
    //     {
    //         id:1,
    //         name: "Katarina Maksimovic",
    //         img: "https://www.medias.rs/images/14/1447/srculence.jpg"
    //     },
    //     {
    //         id:2,
    //         name: "Katarina Maksimovic",
    //         img: "https://www.medias.rs/images/14/1447/srculence.jpg"
    //     },
    //     {
    //         id:3,
    //         name: "Katarina Maksimovic",
    //         img: "https://www.medias.rs/images/14/1447/srculence.jpg"
    //     },
    //     {
    //         id:4,
    //         name: "Katarina Maksimovic",
    //         img: "https://www.medias.rs/images/14/1447/srculence.jpg"
    //     }
    // ];

    const {stories, story} = useSelector(state=>state.stories);
    //const {myStory} = useSelector(state=>state.story);

    console.log(stories);
    console.log(story);
    

    return (
        <div className="stories">
             <div className="story">
                    {story ? <img src={story.image} alt=""/> : <img src={currentUser.user.profileImg} alt=""/> }
                    <span>{currentUser.user.firstName} {currentUser.user.lastName}</span>
                    {/* <button onClick={handleClickOpen}>+</button> */}
                    <Button onClick={handleClickOpen}>
                        <AddIcon />
                    </Button>
               
                         <Dialog  open={open} onClose={handleClose} sx={{display:"flex" , justifyContent:"center", alignSelf:"center", height:"100%"}}>
                         <DialogTitle style={{ backgroundColor: 'white', color: '#975F9B', alignSelf:"center"}} id="form-dialog-title">Add new story</DialogTitle>
                         <DialogContent style={{display:"flex" , backgroundColor: 'white', maxHeight:"500px", height:"100%"}}>
                         <Grid container style={{ display: 'flex', height:"210px", marginTop:"5px"}}>
                         
                         <Grid container >
                         <TextField
                         
                             name="image"
                             variant="outlined"
                             label="Image"
                             //value={storyData.image}
                             fullWidth
                             onChange={(e) => setStoryData({ ...storyData, image: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="description"
                             variant="outlined"
                             label="Description"
                            //  value={storyData.description}
                             fullWidth
                             onChange={(e) => setStoryData({ ...storyData, description: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="location"
                             variant="outlined"
                             label="Location"
                             //value={storyData.location}
                             fullWidth
                             onChange={(e) => setStoryData({ ...storyData, location: e.target.value })}
                         />
                         </Grid>
                         </Grid>
                         </DialogContent>
                         <DialogActions  style={{ backgroundColor: 'white'}}>
                         <Button style={{ backgroundColor: '#975F9B', color:"white"}}  onClick={handleClose}>
                             Cancel
                         </Button>
                         <Button style={{ backgroundColor: '#975F9B', color:"white"}} onClick={handleSubmit}>
                             Add story
                         </Button> 
                         </DialogActions>
                     </Dialog>
                     
                
                </div>
            {stories.map(story =>(
                <div className="story" key={story.id}>
                    <img src={story.image} alt=""/>
                    <span>{story.user.firstName} {story.user.lastName}</span>
                </div>

            ))}
        </div>
    )
}

export default Stories;