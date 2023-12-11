import * as api from '../api';
import {UPDATE_POST,DELETE_POST,SEND_MESSAGE, END_LOADING_POSTS,START_LOADING_POSTS,FETCH_ALL_POSTS, CREATE_POST,FETCH_FOLLOWINGS_POSTS,LIKE_POST,DISLIKE_POST,COMMENT_POST,FETCH_NOT_FOLLOWINGS_POSTS } from '../constants/actionTypes.js'

export const getPosts = (id) => async(dispatch) => {
    try {
        const {data} = await api.fetchPosts(id);

        console.log(data)
    
       dispatch({ type: FETCH_ALL_POSTS, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}

export const getPostsOfUserAndHisFollowings = (id) => async(dispatch) => {
    try {
        const {data} = await api.GetPostsOfUserAndHisFollowings(id);

        console.log(data)
    
       dispatch({ type: FETCH_FOLLOWINGS_POSTS, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}
export const getPostsOfNotFollowingUsers = (id) => async(dispatch) => {
  try {

    dispatch({type: START_LOADING_POSTS});

      const {data} = await api.GetPostsOfNotFollowingUsers(id);

      console.log(data)
  
     dispatch({ type: FETCH_NOT_FOLLOWINGS_POSTS, payload: data });

     dispatch({type: END_LOADING_POSTS});
  
  } catch (error) {
      console.log(error.message);
  }
}
export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);

        dispatch({type: CREATE_POST, payload: data});

    } catch (error) {
        console.log(error);
    }
}

export const likePost = (postId, userId) => async (dispatch) => {
    try {
        
        console.log(postId)
        console.log(userId)
      const { data } = await api.likePost(postId, userId);
  
    console.log(data)
    
      dispatch({ type: LIKE_POST, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
  export const dislikePost = (postId, userId) => async (dispatch) => {
    try {
        
        console.log(postId)
        console.log(userId)
      const { data } = await api.dislikePost(postId, userId);
  
    console.log(data)
    
      dispatch({ type: DISLIKE_POST, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
  export const commentPost = (comment) => async (dispatch) => {
    try {
        
        console.log(comment)
      const { data } = await api.commentPost(comment);
  
    console.log(data)
    
      dispatch({ type: COMMENT_POST, payload: data });
    } catch (error) {
      console.log(error);
    }
  };


  export const updatePost = (post, newDescription) => async (dispatch) => {
    try {
  
      
      const { data } = await api.updatePost(post, newDescription);
  
      
      dispatch({ type: UPDATE_POST, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

  export const deletePost = (post , userId) => async (dispatch) => {
    try {
     
      await api.deletePost(post , userId);
  
      dispatch({ type: DELETE_POST, payload: post.id });

      alert("POST IS DELETED")
    } catch (error) {
      console.log(error);
    }
  };
