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
    const initialState = {
        description: "",
       
        user: currentUser.user,
        post: post
    };
    const [data, setData] = useState(initialState);

    const addComment = async () => {
        //e.preventDefault();
        console.log(data)
        dispatch(commentPost(data));
    };

    return(
        <div className="comments">
            <div className="write">
            <img src={currentUser.user.profileImg} alt=""/>
            <TextField
                    name="comment"
                    variant="outlined"
                    label="Write a comment"
                    fullWidth
                    onChange={(e) => setData({...data, description:e.target.value}) }
                    />
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