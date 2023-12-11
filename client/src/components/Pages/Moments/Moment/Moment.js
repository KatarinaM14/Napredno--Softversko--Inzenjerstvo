import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
//import useStyles from "./style.js";
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
    //const classes = useStyles();
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
            console.log("red")
           dispatch(likePost(post.id, currentUser.user));
        }else if(isActive == true && isFound){
            console.log("grey")
            dispatch(dislikePost(post.id, currentUser.user));
        }
        setIsActive(!isActive);
    };
    // const currentUser = JSON.parse(localStorage.getItem("profile"));

    // const dispatch = useDispatch();
    // const classes = useStyles();

    // useEffect(()=>{
    //     dispatch(getPostsOfNotFollowingUsers(currentUser.user.id));
    // },[]);

    // const {posts, isLoading} = useSelector(state=>state.posts);

    // console.log(posts);
    // //console.log(isLoading);
    // console.log(currentUser.user.id);
   //// const classes = useStyles();
    return (
        // <Card sx={{ maxWidth: "50%" }}>
        // <CardActionArea onClick={handleClickOpen}>
        //   <CardMedia
        //     component="img"
        //     height="30%"
        //     image={post.image}
        //     alt="green iguana"
        //   />
        //   {/* <CardContent>
        //     <Typography gutterBottom variant="h5" component="div">
        //       Lizard
        //     </Typography>
        //     <Typography variant="body2" color="text.secondary">
        //       Lizards are a widespread group of squamate reptiles, with over 6,000
        //       species, ranging across all continents except Antarctica
        //     </Typography>
        //   </CardContent> */}
        // </CardActionArea>
<>
       {/* <Card sx={{maxWidth: "30%" }}> */}
            <CardActionArea onClick={handleClickOpen} className="Image"   sx={{maxWidth: "24%",height: "300px", className:"Image" }} >
                <ImageListItem key={post?.id} style={{objectFit:"fill"}}>
                    <img
                    src={`${post?.image}`}
                 
                    loading="lazy"
                    />
                    {/* <ImageListItemBar position="below" title={post.user.username} /> */}
                </ImageListItem>
            </CardActionArea>
                   
       {/* </Card> */}
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: "100%" } }}
      maxWidth="xs"  open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <Card sx={{ maxWidth: "100%" }}>
                    <CardHeader
                        avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={post.user.profileImg}>
                            {post.user.profileImg}
                        </Avatar>
                        }
                        // action={
                        // <IconButton aria-label="settings">
                        //     <MoreVertIcon />
                        // </IconButton>
                        // }
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
                            // onClick={() => {changeColor(); dispatch(likePost(post.id, currentUser.user))}
                            onClick={() => {changeColor()}
                        }>
                            <FavoriteIcon /> {post.likes.length}
                        </IconButton>
                        {/* <IconButton aria-label="share">
                        <ShareIcon />
                        </IconButton> */}
                        {/* <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        >
                        <ExpandMoreIcon />
                        </ExpandMore> */}
                    </CardActions>
                    {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                        <Typography paragraph>Method:</Typography>
                        <Typography paragraph>
                            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                            aside for 10 minutes.
                        </Typography>
                        <Typography paragraph>
                            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
                            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
                            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
                            large plate and set aside, leaving chicken and chorizo in the pan. Add
                            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
                            stirring often until thickened and fragrant, about 10 minutes. Add
                            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                        </Typography>
                        <Typography paragraph>
                            Add rice and stir very gently to distribute. Top with artichokes and
                            peppers, and cook without stirring, until most of the liquid is absorbed,
                            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
                            mussels, tucking them down into the rice, and cook again without
                            stirring, until mussels have opened and rice is just tender, 5 to 7
                            minutes more. (Discard any mussels that don&apos;t open.)
                        </Typography>
                        <Typography>
                            Set aside off of the heat to let rest for 10 minutes, and then serve.
                        </Typography>
                        </CardContent>
                    </Collapse> */}
                    </Card>       
            </Dialog>
            </> 
    );
}

export default Moment;