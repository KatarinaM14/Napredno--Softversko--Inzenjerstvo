import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from "react-router-dom";
import Comments from "../../Comments/Comments";
import { format } from "timeago.js";
import { likePost,dislikePost } from "../../../actions/posts";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { updatePost,deletePost } from "../../../actions/posts";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';

const Post = ({post, connection}) => {
    
    const currentUser = JSON.parse(localStorage.getItem("profile"));

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [commentOpen, setCommentOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [newDescription, setNewDescription] = useState(post?.description);

    useEffect(()=>{
     
    },[newDescription]);

    const isFound = post?.likes?.find(p => {
        if(p?.id == currentUser?.user?.id){
            return true;
        }
        return false;
    });

    const changeColor = async () => {
        if(isActive == false && !isFound){
            console.log("red")
           dispatch(likePost(post?.id, currentUser?.user));

           console.log(currentUser?.user?.id)
           console.log(post?.user.id)
           console.log(post?.id)
           console.log(connection)

            await connection?.invoke("SendNotificationPostLiked", 
            currentUser?.user?.id, post?.user?.id, post?.id, currentUser?.user?.username)
            .catch(console.error());
           
        }else if(isActive == true && isFound){
            console.log("grey")
            dispatch(dislikePost(post?.id, currentUser?.user));
        }
        setIsActive(!isActive);
    };

    const handleClick = (user) => {
        console.log(user)
        navigate("/profile", {state: {u : user}});
       
    }
    const handleClickOpenUpdate = () => {
        setOpenUpdate(true);
      };
      const handleCloseUpdate = () => {
        setOpenUpdate(false);
      };
      

    const handleClickDeletePost = () => {
        dispatch(deletePost(post, post?.user?.id))
        setOpenUpdate(false);
      };



      const handleClickUpdatePost = () => {
        dispatch(updatePost(post, newDescription));
        setOpenUpdate(false);
      };

    console.log(post?.likes);
    console.log(post?.likes?.length);

    const liked = true;
    console.log(post)
    console.log(currentUser?.user?.id)
    console.log(currentUser?.user?.role)
    console.log(post?.user?.id)
    
    return (
        <div className="post">
           <div className="container">
           <div className="user">
                <div className="userInfo">
                    <img src={post?.user?.profileImg} alt=""/>
                    <div className="details" onClick={()=>handleClick(post?.user)}>
                        {/* <Link to={'/profile/${posts.userId}'} style={{textDecoration:"none", color:"inherit"}}> */}
                            <span className="name">{post?.user?.firstName} {post?.user?.lastName}</span>
                        {/* </Link> */}
                        <span className="date">{format(post?.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="content">
                <p>{post?.description}</p>
                <img src={post?.image} alt=""/>
            </div>
            <div className="info">
                <div className="item">
                    <IconButton 
                        aria-label="add to favorites" 
                        style={{color : isActive ? 'red' : '#a3a3a3'}} 
                        onClick={() => {changeColor()}
                    }>
                        <FavoriteIcon /> {post?.likes?.length}
                    </IconButton>
                </div>
                <div className="item" onClick={()=>setCommentOpen(!commentOpen)}>
                    <TextsmsOutlinedIcon/>
                    {post?.comments?.length}
                </div>
                {(currentUser)&&((currentUser?.user?.role==="Administrator") || (currentUser?.user?.id===post?.user?.id))&&(
               <Grid>
               <Button  style={{color: '#975F9B'}} onClick={handleClickOpenUpdate}>Update</Button>
                   <Dialog open={openUpdate} onClose={handleCloseUpdate} >
                     <DialogTitle  style={{ backgroundColor: 'white', color: '#975F9B'}} >Update description</DialogTitle>
                     <DialogContent  style={{ backgroundColor: 'white'}}>
                     <Grid container  >
                       <Grid container style={{ marginTop: '5px'}}>
                       <TextField
                         name="description"
                         variant="outlined"
                         label="Description"
                         value={newDescription}
                         fullWidth
                         onChange={(e) => setNewDescription( e.target.value )}
                       />
                       </Grid>
                      </Grid>
                     </DialogContent>
                     <DialogActions style={{ backgroundColor: 'white'}}>
                       <Button style={{ backgroundColor: '#975F9B' , color:"white"}} onClick={handleCloseUpdate} >
                         Cancel
                       </Button>
                       <Button style={{ backgroundColor: '#975F9B', color:"white"}} onClick={handleClickUpdatePost} >
                         Update
                       </Button>
                     </DialogActions>
                   </Dialog>
                  <Button size="small"  style={{color: '#975F9B'}} onClick={handleClickDeletePost}>
                        Delete
                  </Button>
                  </Grid>
                )}
            </div>
            {commentOpen && <Comments post={post} connection={connection} key={post?.id}/>}
           </div>
        </div>
    );
}

export default Post;