import React,{ useState ,  useEffect } from "react";
//import "./rightbar.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./profile.scss";
import Posts from "../Posts/Posts";
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser,updateUser,getUsers,deleteUser } from "../../actions/users";
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from "react-router-dom";
import { getPosts } from "../../actions/posts";
import Post from "../Posts/Post/Post";
import { getFollowers,getFollowing,getUser } from "../../actions/auth";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import UserList from "./UserList/UserList.js";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { createConversation } from "../../actions/chat";

const Profile = ({connection}) => {
    const current = JSON.parse(localStorage.getItem("profile"));
    console.log(JSON.parse(localStorage.getItem("profile")).user)
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const {posts} = useSelector(state=>state.posts);
    const {authData, userCurrent, allUsers} = useSelector(state=>state.auth);
    //const [currentUser, setCurrentUser] = useState(authData.find(u => u.id === current.id));


    const currentUser = authData?.find(u => u.id === current?.user.id);
    console.log(current)
    console.log(connection)
    // useEffect(()=>{
      
      // },[authData]);
      useEffect(()=>{
        console.log("all users")
        dispatch(getUsers());
      },[]);
      
      console.log(allUsers)
    const [userData, setUserData] = useState({
        id: currentUser?.id,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        username: currentUser?.username,
        email: currentUser?.email,
        password: currentUser?.password,
        role: currentUser?.role,
        city: currentUser?.city,
        phoneNumber: currentUser?.phoneNumber,
        profileImg: currentUser?.profileImg,
        biography: currentUser?.biography,
        likedPosts: currentUser?.likedPosts,
        followers: currentUser?.followers,
        following: currentUser?.following,
        posts: currentUser?.posts,
        comments: currentUser?.comments,
        stories: currentUser?.stories,
        webSites: currentUser?.webSites,
      });
      const [open, setOpen] = React.useState(false);
      //const [openMessanger, setOpenMessanger] = React.useState([currentUser]);
      const user = location.state?.u;
      console.log(user)
      console.log(authData)
      console.log(currentUser)
      const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickOpenMessanger = () => {

      const members = [currentUser, user]
      console.log(members)
      console.log("OPEENNN MESSANGERRR")
      console.log(currentUser)
      console.log(user)
      //setOpenMessanger([...openMessanger, currentUser] );
     // console.log(openMessanger)
      //setOpenMessanger(...openMessanger, user );

      //console.log(openMessanger)
      dispatch(createConversation(members, navigate));

      navigate("/chat");
  };

 // console.log(openMessanger)

    const [openAllUsers, setOpenAllUsers] = useState(false);
    

    const handleClickOpenAllUsers = () => {
      setOpenAllUsers(true);
  };

  const handleCloseAllUsers = () => {
    setOpenAllUsers(false);
};
    const handleClose = () => {
        setOpen(false);
    };

    
    const handleSubmit =async (e) => {
        e.preventDefault();
  
        dispatch(updateUser(userData));
         
        setOpen(false);
    };


      const [isUserFollowed, setUserFollowed] = useState(currentUser?.following.some(
          u => u.id === user.id
      ));

    useEffect(()=>{
        if(currentUser?.id === user?.id){
            console.log("Current")
            dispatch(getUser(currentUser?.id));
            dispatch(getPosts(currentUser?.id));

            //items.find(item => item.id === itemIdToFind)
            //setCurrentUser(authData.find(u => u.id === currentUser.id))
            console.log(currentUser)
            //dispatch(getFollowers(currentUser?.id));
            //dispatch(getFollowing(currentUser?.id));
        }else{
            console.log("NOT Current")
            dispatch(getUser(user?.id));
            dispatch(getPosts(user?.id));
            dispatch(getFollowers(user?.id));
            dispatch(getFollowing(user?.id));

            // setUserFollowed(currentUser?.user.following.some(
            //     u => u.id === user.id
            // ));
            // console.log(isUserFollowed)
        }

        // if(authData){
        //     authData.forEach(element => {
        //         if(element.id == currentUser.user.id){
        //             setUserFollowed(element.following.some(
        //                 u => u.id === user.id
        //             ));
        //         }
        //     });
        // }
    },[currentUser]);


    console.log(posts)
    console.log(authData)
    console.log(userCurrent)
    console.log(currentUser)
    

    const addProfilePhoto = async (base64, e) => {
     
        setUserData({...userData, profileImg: base64});
        console.log(userData);
        dispatch(addProfilePhoto(currentUser))
        
      };
    //   const isUserFollowed = currentUser?.user.following.some(
    //     u => u.id === user.id
    // );


    const follow = async (userId, e) => {
        e.preventDefault();
  
        console.log(userId)
        dispatch(followUser(currentUser, userId));

        setUserFollowed(!isUserFollowed);
        // setUserFollowed(currentUser?.user.following.some(
        //     u => u.id === user.id
        // ));
         console.log(isUserFollowed)
         console.log(current?.user?.id)
         console.log(userId)
         console.log(current?.user?.username)

         await connection?.invoke("SendNotificationFollow", 
         current.user.id, userId, current.user.username)
         .catch(console.error());
        
      };
    const unfollow = (userId, e) => {
        e.preventDefault();
  
        console.log(userId)
        dispatch(unfollowUser(currentUser, userId));
        
        console.log(currentUser?.following)

        setUserFollowed(!isUserFollowed);
        // setUserFollowed(currentUser?.user.following.some(
        //     u => u.id === user.id
        // ));
         console.log(isUserFollowed)
      };
    
     

    console.log(isUserFollowed)


    const [openFollowers, setOpenFollowers] = React.useState(false);
    const [scrollFollowers, setScrollFollowers] = React.useState('body');
  
    const handleClickOpenFollowers = (scrollType) => () => {
      setOpenFollowers(true);
      setScrollFollowers(scrollType);
    };
  
    const handleCloseFollowers = () => {
      setOpenFollowers(false);
    };
  
    const descriptionElementRefFollowers = React.useRef(null);
    React.useEffect(() => {
      if (openFollowers) {
        const { current: descriptionElement } = descriptionElementRefFollowers;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [openFollowers]);


    const [openFollowing, setOpenFollowing] = React.useState(false);
    const [scrollFollowing, setScrollFollowing] = React.useState('body');
  
    const handleClickOpenFollowing = (scrollType) => () => {
      setOpenFollowing(true);
      setScrollFollowing(scrollType);
    };
  
    const handleCloseFollowing = () => {
      setOpenFollowing(false);
    };
  
    const descriptionElementRefFollowing = React.useRef(null);
    React.useEffect(() => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRefFollowing;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [open]);

    const handleListItemClick = (value) => {
        // onClose(value);
        setOpenFollowing(false);
        setOpenFollowers(false);
        navigate("/profile", {state: {u : value}});
      };

    return(
        <div className="profileInfo">
            <div className="images">
                <img src="https://e0.pxfuel.com/wallpapers/443/429/desktop-wallpaper-universe-stars-night-violet-starry-sky-purple.jpg" alt="" className="cover"/>
               
                {
                    (currentUser)&&(currentUser?.id === user?.id)&&
                    (currentUser?.profileImg ? ( <img src={currentUser?.profileImg} alt="" className="profilePic"/>) :
                    (
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <AccountCircleIcon />
                        <div className='container mr-60'>
                        <FileBase type="file" multiple={false} onDone={({base64})=> addProfilePhoto(base64)}/>
                   
                        </div> 
                    </IconButton>
                    ))
                }
                {
                    (user)&&(currentUser?.id !== user?.id)&&
                    (user.profileImg ? ( <img src={user.profileImg} alt="" className="profilePic"/>) :
                    (
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <AccountCircleIcon />
                        {/* <div className='container mr-60'>
                        <FileBase type="file" multiple={false} onDone={({base64})=> addProfilePhoto(base64)}/>
                   
                        </div>  */}
                    </IconButton>
                    ))
                }
            </div>
            <div className="profileContainer">
                <div className="uInfo">
                    <div className="leftProfileInfo">
                    {(currentUser)&&(currentUser?.role==="Administrator")&&
                    (<Button onClick={handleClickOpenAllUsers} style={{color:"#975F9B"}}>
                      All users
                  </Button>)}
     
               <Dialog  sx={{display:"flex" , justifyContent:"center", alignSelf:"center", height:"100%"}}   open={openAllUsers} onClose={handleCloseAllUsers} >
               <DialogTitle  style={{ backgroundColor: 'white', color:'#975F9B', alignSelf:"center"}} id="form-dialog-title">All users</DialogTitle>
               <DialogContent style={{display:"flex" , maxHeight:"800px", backgroundColor: 'white', height:"100%"}}>
               <Grid container style={{ display: 'flex', height:"500px", marginTop:"5px"}} >
               
             
               {allUsers?.map((user) =>(
                        <Grid key={user.id} item lg={12} md={12} xs={12}>
                            <Grid >
                              <Grid   elevation={6} style={{display: "flex", flexDirection:"row", height:"70px"}} >
                                <div style={{display: "flex", flexDirection:"row",width:"100%", alignContent:"space-between"}}>
                              <Grid direction="row" container  style={{backgroundColor: 'white', gap:"10px"}}>

                                <Avatar  src={user.profileImg} />
                                <Typography xs={{fontSize:"5px"}}  style={{marginTop:"10px"}} >{user.firstName+ " "+ user.lastName}</Typography>
                                
                                </Grid>
                                <Grid  container  style={{backgroundColor: 'white', width:"20%"}}>
                                {/* <Grid > */}
                                    <Button  size="small" style={{backgroundColor: '#975F9B', color: 'white',width:"100%", height:"50%"}} onClick={() => dispatch(deleteUser(user.id))}>
                                      {/* <Delete fontSize="small" /> &nbsp; Obrisi */}
                                    Delete
                                    </Button>
                                {/* </Grid> */}
                                </Grid>
                                </div>
                              </Grid>
                          </Grid>
                        </Grid>
                    ))}
               </Grid>
               </DialogContent>
               {/* <DialogActions  style={{ backgroundColor: 'white'}}>
               <Button style={{ backgroundColor: '#975F9B', color:"white"}}  onClick={handleClose}>
                  Cancel
               </Button>
               <Button style={{ backgroundColor: '#975F9B', color:"white"}} onClick={handleSubmit}>
                  Save changes
               </Button> 
               </DialogActions> */}
           </Dialog>
                        {(currentUser)&&(currentUser?.id === user?.id)&&
                        (currentUser.webSites && (currentUser.webSites.map(site=>(
                            (site.includes("facebook")) && (<a href={site}>
                            <FacebookTwoToneIcon fontSize="large" />
                            </a>)

                            (site.includes("instagram")) && (<a href={site}>
                                <InstagramIcon fontSize="large" />
                                </a>))
                            
                        )))}
                        {(user)&&(currentUser?.id !== user?.id)&&
                             (user.webSites && (user.webSites.map(site=>(
                                (site.includes("facebook")) && (<a href={site}>
                                <FacebookTwoToneIcon fontSize="large" />
                                </a>)
    
                                (site.includes("instagram")) && (<a href={site}>
                                    <InstagramIcon fontSize="large" />
                                    </a>)))))
                        }
{/*                         
                        <a href="http://facebook.com">
                        <TwitterIcon fontSize="large" />
                        </a>
                        <a href="http://facebook.com">
                        <LinkedInIcon fontSize="large" />
                        </a>
                        <a href="http://facebook.com">
                        <PinterestIcon fontSize="large" />
                        </a> */}
                    </div>
                    <div className="centerProfileInfo">
                        {(currentUser)&&(currentUser?.id === user?.id)&&(<span>{currentUser?.firstName} {currentUser?.lastName}</span>)}
                        {(user)&&(currentUser?.id !== user?.id)&&(<span>{user.firstName} {user.lastName}</span>)}
                        <div className="info">
                        <div className="item">
                            <PlaceIcon />
                            {(currentUser)&&(currentUser?.id === user?.id)&&(<span>{currentUser?.city}</span>)}
                            {(user)&&(currentUser?.id !== user?.id)&&(<span>{user.city}</span>)}
                        </div>
                        <div className="item">
                            {/* <LanguageIcon /> */}
                            {(currentUser)&&(currentUser?.id === user?.id)&&(<span>{currentUser?.biography}</span>)}
                            {(user)&&(currentUser?.id !== user?.id)&&(<span>{user.biography}</span>)}
                        </div>
                        </div>
                        {/* <button>follow</button> */}
                        {(currentUser)&&(currentUser?.id !== user?.id)&&
                        (!isUserFollowed)&&(
                            <Button style={{ backgroundColor:'#975F9B'}} onClick={(e)=>follow(user.id,e)}>
                                Follow
                            </Button> 
                        )}
                         {(currentUser)&&(currentUser?.id !== user?.id)&&
                        (isUserFollowed)&&(
                            <Button style={{ backgroundColor: '#975F9B'}} onClick={(e)=>unfollow(user.id,e)}>
                                Unfollow
                            </Button> 
                        )}
                    </div>
                    <div className="rightProfileInfo">
                        <div className="numberOfFollowingAndFollowers">
                            <div className="numberOfFollowers" onClick={handleClickOpenFollowers('body')}>
                                {(currentUser)&&(currentUser?.id === user?.id)&& (authData) && ("Followers " + authData.find(u => u.id === currentUser?.id)?.followers?.length)}
                                {(user)&&(currentUser?.id !== user?.id)&& (authData)&&("Followers " + authData.find(u => u.id === user?.id)?.followers?.length)}
                            </div>
                            <div className="numberOfFollowing" onClick={handleClickOpenFollowing('body')}>
                                {(currentUser)&&(currentUser?.id === user?.id)&& (authData) && ("Following " + authData.find(u => u.id === currentUser?.id)?.following?.length)}
                                {(user)&&(currentUser?.id !== user?.id)&& (authData)&&("Following " + authData.find(u => u.id === user?.id)?.following?.length)}
                            </div>
                        </div>
                        {(currentUser)&&(currentUser?.id !== user?.id)&&
                            (<Button onClick={handleClickOpenMessanger}>
                                <EmailOutlinedIcon style={{ color: '#975F9B'}}/>
                            </Button>)}
                        {/* <MoreVertIcon /> */}
                        {(currentUser)&&(currentUser?.id === user?.id)&&
                            (<Button onClick={handleClickOpen}>
                                <AddIcon />
                            </Button>)}
               
                         <Dialog  sx={{display:"flex" , justifyContent:"center", alignSelf:"center", height:"100%"}}   open={open} onClose={handleClose} >
                         <DialogTitle  style={{ backgroundColor: 'white', color:'#975F9B', alignSelf:"center"}} id="form-dialog-title">Change profile</DialogTitle>
                         <DialogContent style={{display:"flex" , maxHeight:"800px", backgroundColor: 'white', height:"100%"}}>
                         <Grid container style={{ display: 'flex', height:"500px", marginTop:"5px"}} >
                         
                       
                         <Grid container >
                         <TextField
                             name="firstName"
                             variant="outlined"
                             label="First name"
                             value={userData.firstName}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="lastName"
                             variant="outlined"
                             label="Last name"
                             value={userData.lastName}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="username"
                             variant="outlined"
                             label="Username"
                             value={userData.username}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="email"
                             variant="outlined"
                             label="Email"
                             value={userData.email}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="city"
                             variant="outlined"
                             label="City"
                             value={userData.city}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="phoneNumber"
                             variant="outlined"
                             label="Phone number"
                             value={userData.phoneNumber}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         <TextField
                             name="biography"
                             variant="outlined"
                             label="Biography"
                             value={userData.biography}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, biography: e.target.value })}
                         />
                         </Grid>
                         <Grid container >
                         {/* <TextField
                         
                             name="profileImg"
                             variant="outlined"
                             label="Image"
                             value={userData.profileImg}
                             fullWidth
                             onChange={(e) => setUserData({ ...userData, profileImg: e.target.value })}
                         /> */}
                         <FileBase type="file" multiple={false} onDone={({base64})=>setUserData({...userData,profileImg:base64})}/>
                         </Grid>
                         </Grid>
                         </DialogContent>
                         <DialogActions  style={{ backgroundColor: 'white'}}>
                         <Button style={{ backgroundColor: '#975F9B', color:"white"}}  onClick={handleClose}>
                            Cancel
                         </Button>
                         <Button style={{ backgroundColor: '#975F9B', color:"white"}} onClick={handleSubmit}>
                            Save changes
                         </Button> 
                         </DialogActions>
                     </Dialog>
                     <Dialog
                        open={openFollowers}
                        onClose={handleCloseFollowers}
                        scroll={scrollFollowers}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogTitle id="scroll-dialog-title">Followers</DialogTitle>
                        <DialogContent dividers={scrollFollowers === 'body'}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRefFollowers}
                            tabIndex={-1}
                        >
                          <List sx={{ pt: 0 }}>
        {(currentUser)&&(currentUser?.id === user?.id)&&
                              (currentUser?.followers?.map((f) => (
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick(f)} key={f}>
              <ListItemAvatar>
                <Avatar src={f.profileImg} sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={f.firstName + " " + f.lastName} />
            </ListItemButton>
          </ListItem>
        )))}
        {(user)&&(currentUser?.id !== user?.id)&&
                              (user?.followers?.map((f) => (
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick(f)} key={f}>
              <ListItemAvatar>
                <Avatar src={f.profileImg} sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={f.firstName + " " + f.lastName} />
            </ListItemButton>
          </ListItem>
        )))}
        {/* <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('addAccount')}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem> */}
      </List>
                        
                        </DialogContentText>
                        </DialogContent>
                        {/* <DialogActions>
                        <Button onClick={handleClickOpenFollowers}>Cancel</Button>
                        <Button onClick={handleClickOpenFollowers}>Subscribe</Button>
                        </DialogActions> */}
                    </Dialog>
                        <Dialog
                            open={openFollowing}
                            onClose={handleCloseFollowing}
                            scroll={scrollFollowing}
                            aria-labelledby="scroll-dialog-title"
                            aria-describedby="scroll-dialog-description"
                        >
                            <DialogTitle id="scroll-dialog-title">Following</DialogTitle>
                            <DialogContent dividers={scrollFollowing === 'body'}>
                            <DialogContentText
                                id="scroll-dialog-description"
                                ref={descriptionElementRefFollowing}
                                tabIndex={-1}
                            >
                              {/* {(currentUser)&&(currentUser?.id === user?.id)&&
                              (currentUser?.following.map(f=>{
                                
                              }))} */}

<List sx={{ pt: 0 }}>
        {(currentUser)&&(currentUser?.id === user?.id)&&
                              (currentUser?.following?.map((f) => (
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick(f)} key={f}>
              <ListItemAvatar>
                <Avatar src={f.profileImg} sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={f.firstName + " " + f.lastName} />
            </ListItemButton>
          </ListItem>
        )))}
        {(user)&&(currentUser?.id !== user?.id)&&
                              (user?.following?.map((f) => (
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick(f)} key={f}>
              <ListItemAvatar>
                <Avatar src={f.profileImg} sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={f.firstName + " " + f.lastName} />
            </ListItemButton>
          </ListItem>
        )))}
        {/* <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('addAccount')}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem> */}
      </List>

                            </DialogContentText>
                            </DialogContent>
                            {/* <DialogActions>
                            <Button onClick={handleCloseFollowing}>Cancel</Button>
                            <Button onClick={handleCloseFollowing}>Subscribe</Button>
                            </DialogActions> */}
                        </Dialog>
                    </div>
                </div>
                <div className="posts">

                    {posts && posts.map(post =>(
                <Post post={post} key={post.id}/>
                ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;