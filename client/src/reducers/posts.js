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
                      posts: action.payload,
                    //   currentPage: action.payload.currentPage,
                    //   numberOfPages: action.payload.numberOfPages,
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
        ///return { ...state.posts, posts: state.posts.likes.filter((user) => user.id !== action.payload.user.id) };  
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

//import { START_LOADING_DONATIONS, FETCH_ALL_DONATIONS,END_LOADING_DONATIONS,FETCH_DONATIONS_BY_SEARCH,FETCH_DONATION,DONATE_TO_DONATION,UPDATE_DONATION,DELETE_DONATION,CREATE_DONATION, FETCH_LATEST_DONATIONS } from "../constants/actionTypes";

// export default (state = { isLoading: true, donations: [] }, action) => {
//     switch (action.type) {
//       case START_LOADING_DONATIONS:
//         return { ...state, isLoading: true };
//       case END_LOADING_DONATIONS:
//         return { ...state, isLoading: false };
//       case FETCH_ALL_DONATIONS:
//         return {
//           ...state,
//           donations: action.payload.data,
//           currentPage: action.payload.currentPage,
//           numberOfPages: action.payload.numberOfPages,
//         };

//         case FETCH_DONATIONS_BY_SEARCH:
         
//         return {
//           ...state,
//           donations: action.payload
//         };
//       case FETCH_DONATION:
//         return {
//           ...state,
//           donation: action.payload.data
//         };
//       case UPDATE_DONATION:
       
//         return { ...state, donations: state.donations.map((donation) => (donation._id === action.payload._id ? action.payload : donation)) };
//       case DELETE_DONATION:
//         return {
//           ...state,
//           response: action.payload.data
//         };
//       case CREATE_DONATION:
        
//         return { ...state, donations: [...state.donations, action.payload] };
      
//       case FETCH_LATEST_DONATIONS:
//         {
          
//           return{...state,donations:action.payload.data
//           };
//         }


//       case DONATE_TO_DONATION:
//         return {
//           ...state,
//           response: action.payload.data
//         };
   
//       default:
//         return state;
//     }
//   };
