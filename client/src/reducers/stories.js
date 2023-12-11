import {START_LOADING_STORIES,END_LOADING_STORIES,FETCH_FOLLOWINGS_STORIES, FETCH_ALL_STORIES, CREATE_STORY,LATEST_STORY,DISLIKE_STORY } from "../constants/actionTypes";

export default (state = { isLoading: true, stories: [], story: {} }, action) => {

   switch (action.type) {
    case START_LOADING_STORIES:
        return { ...state, isLoading: true };
      case END_LOADING_STORIES:
        return { ...state, isLoading: false };
    case FETCH_ALL_STORIES:
        return {
                      ...state,
                      stories: action.payload.data,
                    //   currentPage: action.payload.currentPage,
                    //   numberOfPages: action.payload.numberOfPages,
                    };
    case FETCH_FOLLOWINGS_STORIES:
      console.log(state.stories)
      console.log(action)
      console.log(action.payload)
        return {
          ...state,
          stories: action.payload
        };
    case CREATE_STORY:
        console.log(action)
        console.log(action.payload)
        return { ...state, story:  action.payload };
        //return { ...state, stories: [...state.stories, action.payload] };
    case LATEST_STORY:
        console.log(action)
        console.log(action.payload)
        return { ...state, story:  action.payload };
    // case LIKE_STORY:
    //     console.log(action)
    //     console.log(state.stories)
    //     return { ...state, stories: state.stories.map((story) => (story.id === action.payload.postId ? { ...post, likes: [...post.likes, action.payload.user] } : post)) };
    // case DISLIKE_POST:
    //     console.log(action)
    //     console.log(state.posts)
    //     return { ...state, posts: state.posts.map((post) => (post.id === action.payload.postId ? { ...post, likes: post.likes.filter((user) => user.id !== action.payload.user.id) } : post)) };
   
    default:
        return state;
   }
};

