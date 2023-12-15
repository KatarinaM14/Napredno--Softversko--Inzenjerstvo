import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from "timeago.js";
import { useDispatch } from 'react-redux';
import { likePost } from "../../../../actions/posts.js";
import { dislikePost } from "../../../../actions/posts.js";
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import "./moment.scss"

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));


const Moment=({post}) => {

    const currentUser = JSON.parse(localStorage.getItem("profile"));
    const dispatch = useDispatch();
    console.log(post)
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const isFound = post.likes.find(p => {
        if(p.id == currentUser.user.id){
            return true;
        }
        return false;
    });

    const changeColor = () => {
        if(isActive == false && !isFound){
           dispatch(likePost(post.id, currentUser.user));
        }else if(isActive == true && isFound){
            dispatch(dislikePost(post.id, currentUser.user));
        }
        setIsActive(!isActive);
    };
   
    return (
<>
            <CardActionArea onClick={handleClickOpen} className="Image"   sx={{maxWidth: "24%",height: "300px", className:"Image" }} >
                <ImageListItem key={post?.id} style={{objectFit:"fill"}}>
                    <img
                    src={`${post?.image}`}
                 
                    loading="lazy"
                    />
                </ImageListItem>
            </CardActionArea>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: "100%" } }}
      maxWidth="xs"  open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <Card sx={{ maxWidth: "100%" }}>
                    <CardHeader
                        avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={post.user.profileImg}>
                            {post.user.profileImg}
                        </Avatar>
                        }
                        title={post.user.firstName + " " +post.user.lastName}
                        subheader={format(post.createdAt)}
                    />
                    <CardMedia
                        component="img"
                        height="100%"
                        width="100%"
                        image={post.image}
                        alt="Paella dish"
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                        {post.description}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                    <IconButton 
                            aria-label="add to favorites" 
                            style={{color : isActive ? 'red' : '#a3a3a3'}} 
                            onClick={() => {changeColor()}
                        }>
                            <FavoriteIcon /> {post.likes.length}
                        </IconButton>
                    </CardActions>
                    </Card>       
            </Dialog>
            </> 
    );
}

export default Moment;