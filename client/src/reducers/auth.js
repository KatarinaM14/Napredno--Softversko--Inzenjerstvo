import { AUTH, LOGOUT, DELETE_USER,GET_ALL_USERS, FETCH_USERS, FETCH_USER, UPDATE_USER, START_LOADING_USERS, END_LOADING_USERS, FETCH_ONE_USER,USERS_TO_FOLLOW,FOLLOW_USER,UNFOLLOW_USER,GET_FOLLOWINGS,GET_FOLLOWERS } from '../constants/actionTypes';

export default(state = { isLoading: true, authData: [], userCurrent: [], usersToFollow:[], allUsers:[] }, action) => {

    switch (action.type) {
        case AUTH:
          localStorage.setItem('profile', JSON.stringify({ ...action.data }));
          return { ...state, authData: [...state.authData, action.data.user],userCurrent: action.data.user, loading: false, errors: null };
        case LOGOUT:
          localStorage.clear();
    
          return { ...state, authData: null, loading: false, errors: null };
        case START_LOADING_USERS:
          return { ...state, isLoading: true };
        case END_LOADING_USERS:
          return { ...state, isLoading: false };
        case DELETE_USER:
         
          return { ...state, authData: state.authData.filter((user) => user.id !== action.payload) };
        case FETCH_USERS:
          
          return {
            ...state,
            authData: action.payload,
            
          };
          case GET_ALL_USERS:
          console.log(action.payload)
          return {
            ...state,
            allUsers: action.payload,
            
          };
        case FETCH_USER:
           console.log(state.authData)
           console.log(action.payload)
            return { ...state, authData: [...state.authData, action.payload] }
        case UPDATE_USER: 
          return { ...state, authData: state.authData.map((user) => (user.id === action.payload.id ? action.payload : user)), userCurrent: action.payload };
           
        case FOLLOW_USER:
        {
          console.log(action.payload)    
          return { ...state, authData: state.authData.map((user) => (user.id === action.payload.userId ? {...user, following: [...user.following, action.payload.followedUser]} : user)) };
           
        }
        case UNFOLLOW_USER:
        {
          console.log(action.payload)    
          return { ...state, authData: state.authData.map((user) => (user.id === action.payload.userId ? {...user, following: user.following.filter((u)=> u.id !== action.payload.unfollowedUser.id)} : user)) };
        }
        case FETCH_ONE_USER:
          {    
            return { ...state, user: action.payload }
          }
        case USERS_TO_FOLLOW:
              return { ...state, usersToFollow: action.payload };
        case GET_FOLLOWINGS:
        {
          console.log(action.payload)
          console.log(state.authData)    
          return { ...state, authData: state.authData.map((user) => (user.id === action.payload.userId ? {...user, following: action.payload.following} : user)) };
             
        }
        case GET_FOLLOWERS:
        {
          console.log(action.payload)    
          return { ...state, authData: state.authData.map((user) => (user.id === action.payload.userId ? {...user, followers: action.payload.followers} : user)) };
               
        }
        default:
          return state;
      }
};

