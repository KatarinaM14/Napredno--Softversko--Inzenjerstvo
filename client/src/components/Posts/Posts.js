import React, { useEffect } from "react"; 
import Post from "./Post/Post";
import "./posts.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPostsOfUserAndHisFollowings } from "../../actions/posts";

const Posts = ({connection}) => {

    const currentUser = JSON.parse(localStorage.getItem("profile"));

    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getPostsOfUserAndHisFollowings(currentUser.user.id));
    },[]);

    const {posts} = useSelector(state=>state.posts);

    return (
        <div className="posts">
            {posts.map(post =>(
               <Post post={post} connection={connection} key={post.id}/>
            ))}
        </div>
    );
}

export default Posts;