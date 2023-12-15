import * as api from '../api';
import { REGISTER_USER_IN_CHAT,USERS_CONVERSATIONS,ALL_MESSAGES_IN_CONVERSATION,SEND_MESSAGE, CREATE_CONVERSATION } from "../constants/actionTypes";


export const registerUser = (user) => async (dispatch) => {
    try{
        const {data} = await api.registerUser(user);

        console.log(data)

        dispatch({type: REGISTER_USER_IN_CHAT, payload: data});

    } catch (error) {
        console.log(error);
        console.log(error?.response?.data)
        console.log(error?.response?.status)
    }
};

export const getConversations = (id) => async(dispatch) => {
    try {
        const {data} = await api.getConversations(id);

        console.log(data)
    
       dispatch({ type: USERS_CONVERSATIONS, payload: data });
    
    } catch (error) {
        console.log(error?.message);
    }
}

export const getMessagesInConversations = (id, navigate) => async(dispatch) => {
    try {
        const {data} = await api.getMessagesInConversations(id);

        console.log(data)
    
       dispatch({ type: ALL_MESSAGES_IN_CONVERSATION, payload: data });
    
    } catch (error) {
        console.log(error);
        console.log(error?.response)
        console.log(error?.response?.data)
        console.log(error?.response?.status)
  
        if(error.response?.status)
        {
            navigate("/chat");
        }
    }
}

export const createMessage = (message, navigate) => async (dispatch) => {
    try {
        const { data } = await api.createMessage(message);

        console.log(data)

        dispatch({type: SEND_MESSAGE, payload: data});
    } catch (error) {
        console.log(error);
        console.log(error?.response)
        console.log(error?.response?.data)
        console.log(error?.response?.status)
  
        if(error.response?.status)
        {
            navigate("/chat");
        }
        
    }
}

export const createConversation = (members) => async (dispatch) => {
    try {
        const { data } = await api.createConversation(members);

        console.log(data)

        dispatch({type: CREATE_CONVERSATION, payload: data});
    } catch (error) {
        console.log(error);
    }
}