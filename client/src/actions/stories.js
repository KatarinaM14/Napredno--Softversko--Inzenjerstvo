import * as api from '../api';
import { FETCH_FOLLOWINGS_STORIES,LATEST_STORY,CREATE_STORY } from '../constants/actionTypes.js'

export const getStoriesOfUserAndHisFollowings = (id) => async(dispatch) => {
    try {
        console.log(id)
        const {data} = await api.GetStoriesOfUserAndHisFollowings(id);

        console.log(data)
    
       dispatch({ type: FETCH_FOLLOWINGS_STORIES, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}
export const getLatestStory = (id) => async(dispatch) => {
    try {
        console.log(id)
        const {data} = await api.GetLatestStory(id);

        console.log(data)
    
       dispatch({ type: LATEST_STORY, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}

export const createStory = (story) => async (dispatch) => {
    try {

        console.log(story)
        
        const { data } = await api.createStory(story);

        console.log(data)

        dispatch({type: CREATE_STORY, payload: data});
    } catch (error) {
        console.log(error);
    }
}