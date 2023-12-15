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
                      stories: action.payload.data
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
    case LATEST_STORY:
        console.log(action)
        console.log(action.payload)
        return { ...state, story:  action.payload };
    default:
        return state;
   }
};

