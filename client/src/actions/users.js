import * as api from '../api';
import {GET_ALL_USERS,DELETE_USER,FETCH_USERS_BY_ID, USERS_TO_FOLLOW,FOLLOW_USER,UNFOLLOW_USER,END_LOADING_USERS,FETCH_USERS, FETCH_USER, START_LOADING_USERS, UPDATE_USER ,FETCH_ONE_USER} from '../constants/actionTypes.js';

export const getUsersForFollow = (id) => async(dispatch) => {
    try {
        const {data} = await api.GetUsersForFollow(id);
    
       dispatch({ type: USERS_TO_FOLLOW, payload: data });
    
    } catch (error) {
        console.log(error.message);
    }
}

export const followUser = (currentUser, followedUserId) => async (dispatch) => {
    try {
     

      const { data } = await api.followUser(currentUser, followedUserId);
  
      

      dispatch({ type: FOLLOW_USER, payload: data });

      alert("User is followed")

    } catch (error) {
      console.log(error);
      console.log(error.response)
      console.log(error.response.data)
      console.log(error.response.status)

      if(error.response.status)
        alert(error.response.data)
    }
  };

  export const unfollowUser = (currentUser, followedUserId) => async (dispatch) => {
    try {
     

      const { data } = await api.unfollowUser(currentUser, followedUserId);
  
      

      dispatch({ type: UNFOLLOW_USER, payload: data });

      alert("User is unfollowed")

    } catch (error) {
      console.log(error);
      console.log(error.response)
      console.log(error.response.data)
      console.log(error.response.status)

      if(error.response.status)
        alert(error.response.data)
    }
  };

 export const updateUser = (user) => async(dispatch) => {
    try{
        const { data } = await  api.updateUser( user);

        console.log(data)
      
        dispatch({ type: UPDATE_USER, payload: data});

    }catch(error){
        console.log(error);
        console.log(error);
        console.log(error.response)
        console.log(error.response.data)
        console.log(error.response.status)
  
        if(error.response.status)
          alert(error.response.data)
    }
 };

export const getUsersById = (usersIds) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_USERS });
    const { data } = await api.getUsersById(usersIds);

   console.log(data)

    const res = dispatch({ type: FETCH_USERS_BY_ID, payload:  data  });

    dispatch({ type: END_LOADING_USERS });

  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    
    await api.deleteUser(id);

    dispatch({ type: DELETE_USER, payload: id });

  } catch (error) {
    console.log(error);
  }
};

export const getUsers = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_USERS });
    const { data } = await api.fetchUsers();

    const res = dispatch({ type: GET_ALL_USERS, payload:  data  }); 

    dispatch({ type: END_LOADING_USERS });

  } catch (error) {
    console.log(error);
  }
};
