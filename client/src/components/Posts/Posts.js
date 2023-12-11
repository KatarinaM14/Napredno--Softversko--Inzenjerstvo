import React, { useEffect } from "react"; 
import Post from "./Post/Post";
import "./posts.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPostsOfUserAndHisFollowings } from "../../actions/posts";

const Posts = ({connection}) => {

    const currentUser = JSON.parse(localStorage.getItem("profile"));

    // const posts = [
    //     {
    //         id: 1,
    //         name: "Katarina Maksimovic",
    //         userId: 1,
    //         profilePic: "https://englishteachermarina.files.wordpress.com/2016/09/love-crazed-smiley.png",
    //         desc: "Neki opis",
    //         img: "https://englishteachermarina.files.wordpress.com/2016/09/love-crazed-smiley.png",
    //     },
    //     {
    //         id: 1,
    //         name: "Katarina Maksimovic",
    //         userId: 2,
    //         profilePic: "https://englishteachermarina.files.wordpress.com/2016/09/love-crazed-smiley.png",
    //         desc: "Neki opis",
    //         img: "https://englishteachermarina.files.wordpress.com/2016/09/love-crazed-smiley.png",
    //     }
    // ]
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getPostsOfUserAndHisFollowings(currentUser.user.id));
    },[]);

    const {posts} = useSelector(state=>state.posts);

    console.log(posts);
    //console.log(isLoading);
    console.log(currentUser.user.id);

    return (
        <div className="posts">
            {posts.map(post =>(
               <Post post={post} connection={connection} key={post.id}/>
            ))}
        </div>
    );
}

export default Posts;