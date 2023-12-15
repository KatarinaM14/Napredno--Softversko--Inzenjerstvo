import {UPDATE_POST,DELETE_POST,START_LOADING_POSTS,END_LOADING_POSTS,FETCH_FOLLOWINGS_POSTS, FETCH_ALL_POSTS,FETCH_NOT_FOLLOWINGS_POSTS, CREATE_POST,LIKE_POST,DISLIKE_POST,COMMENT_POST } from "../constants/actionTypes";

export default (state = { isLoading: true, posts: [] }, action) => {

   switch (action.type) {
    case START_LOADING_POSTS:
        return { ...state, isLoading: true };
      case END_LOADING_POSTS:
        return { ...state, isLoading: false };
    case FETCH_ALL_POSTS:
      console.log(action.payload)
      console.log(action.payload.data)
        return {
                      ...state,
                      posts: action.payload
                    };
    case FETCH_FOLLOWINGS_POSTS:
      console.log(state.posts)
      console.log(action)
      console.log(action.payload)
        return {
          ...state,
          posts: action.payload
        };
    case FETCH_NOT_FOLLOWINGS_POSTS:
      console.log(state.posts)
      console.log(action)
      console.log(action.payload)
        return {
          ...state,
          posts: action.payload
        };
    case CREATE_POST:
        console.log(state.posts)
        console.log(action.payload)
        return { ...state, posts: [...state.posts, action.payload] };
    case LIKE_POST:
        console.log(action)
        console.log(state.posts)
        return { ...state, posts: state.posts.map((post) => (post.id === action.payload.postId ? { ...post, likes: [...post.likes, action.payload.user] } : post)) };
    case DISLIKE_POST:
        console.log(action)
        console.log(state.posts)
        return { ...state, posts: state.posts.map((post) => (post.id === action.payload.postId ? { ...post, likes: post.likes.filter((user) => user.id !== action.payload.user.id) } : post)) };
    case COMMENT_POST:
        console.log(action)
        console.log(state.posts)
        return { ...state, posts: state.posts.map((post) => (post.id === action.payload.postId ? { ...post, comments: [...post.comments, action.payload.comment] } : post)) };   
     case UPDATE_POST:
        console.log(action)
        return { ...state, posts: state.posts.map((post) => (post.id === action.payload.id ? action.payload : post)) };
    case DELETE_POST:
      console.log(action)
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    default:
        return state;
   }
};
