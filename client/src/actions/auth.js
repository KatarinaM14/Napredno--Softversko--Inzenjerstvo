import * as api from '../api';
import { AUTH, GET_FOLLOWERS,GET_FOLLOWINGS,USERS_TO_FOLLOW,END_LOADING_USERS,FETCH_USERS, FETCH_USER, START_LOADING_USERS, UPDATE_USER ,DELETE_USER,FETCH_ONE_USER} from '../constants/actionTypes.js';

export const signin= (formData, navigate) => async(dispatch) => {

    try{
        const { data } = await api.signIn(formData);

        console.log(data)

        dispatch({type: AUTH,  data});
       
        console.log(data)
       

       navigate("/home");
    }catch(error){
        console.log(error);
        console.log(error.response);
        console.log(error.response.data);
        alert(error.response.data)
    }
};


export const signup = (formData, navigate) => async(dispatch) => {    
   

    try {
        const { data } = await api.signUp(formData);
    
        dispatch({ type: AUTH, data });

        
    
        navigate("/login");
        ///router.push('/login');
      } catch (error) {
        console.log(error);
        alert(error.response.data)
      }
};

export const getFollowers = (id) => async(dispatch) => {
    try {
        const {data} = await api.getFollowers(id);

        console.log(data)
    
       dispatch({ type: GET_FOLLOWERS, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}

export const getFollowing = (id) => async(dispatch) => {
    try {
        const {data} = await api.getFollowing(id);

        console.log(data)
    
       dispatch({ type: GET_FOLLOWINGS, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}

export const getUser = (id) => async (dispatch) => {
    try{
      
      const { data } = await api.fetchUser(id);

      console.log(data)
  
      dispatch({type: FETCH_USER, payload: data});
      
  }catch(error){
    console.log(error.message);
  }
}
  
