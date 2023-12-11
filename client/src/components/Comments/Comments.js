import { AddComment } from "@mui/icons-material";
import "./comments.scss";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import { useDispatch } from 'react-redux';
import { commentPost } from "../../actions/posts";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Comments = ({post, connection}) =>{
    const currentUser = JSON.parse(localStorage.getItem("profile"));
    const dispatch = useDispatch();
    //const {posts} = useSelector(state=>state.posts);
    const initialState = {
        description: "",
       
        user: currentUser.user,
        post: post
    };
    const [data, setData] = useState(initialState);
    // const comments = [
    //     {
    //         id:1,
    //         desc: "Komentar neki",
    //         name: "Katarina Maksimovic",
    //         userId: 2,
    //         profilePicture: "https://englishteachermarina.files.wordpress.com/2016/09/love-crazed-smiley.png"
    //     },
    //     {
    //         id:2,
    //         desc: "Komentar neki",
    //         name: "Katarina Maksimovic",
    //         userId: 2,
    //         profilePicture: "https://englishteachermarina.files.wordpress.com/2016/09/love-crazed-smiley.png"
    //     }
    // ]
    console.log(post?.comments)
    console.log(data)
    console.log(post)
    // const handleChange = ({currentTarget: input}) => {
    //     setData({...data, description:input.value});
    //     console.log(data)
    // };

    const addComment = async () => {
        //e.preventDefault();
        console.log(data)
        dispatch(commentPost(data));

        console.log(currentUser?.user?.id)
        console.log(post?.user?.id)
        console.log(post?.id)
        console.log(connection)

        await connection?.invoke("SendNotificationPostCommented", 
        currentUser?.user?.id, post?.user?.id, post?.id, currentUser?.user?.username)
        .catch(console.error());
    };

    return(
        <div className="comments">
            <div className="write">
            <img src={currentUser.user.profileImg} alt=""/>
            {/* <input type="text" placeholder="write a comment" onChange={handleChange}/> */}
            <TextField
                    name="comment"
                    variant="outlined"
                    label="Write a comment"
                    fullWidth
                    onChange={(e) => setData({...data, description:e.target.value}) }
                    />
            {/* <button onClick={addComment()}>Send</button> */}
            <Button style={{ backgroundColor: '#975F9B'}} size="small" onClick={() => addComment()}>
                Send
            </Button>
            </div>
            {post.comments && post.comments.map(comment=>(
                <div className="comment">
                    <img src={comment.user.profileImg} alt=""/>
                    <div className="info">
                        <span>{comment.user.firstName} {comment.user.lastName}</span>
                        <p>{comment.description}</p>
                    </div>
                    <span className="date">{format(comment.createdAt)}</span>
                </div>
            ))}
        </div>
    );
}
export default Comments;