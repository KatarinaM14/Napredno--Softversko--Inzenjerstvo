import { REGISTER_USER_IN_CHAT, FETCH_USERS_BY_ID,USERS_CONVERSATIONS,ALL_MESSAGES_IN_CONVERSATION, SEND_MESSAGE,CREATE_CONVERSATION } from "../constants/actionTypes";
//import { FETCH_MESSAGES_FROM_CONVERSATION, NEW_MESSAGE } from "../constants/actionTypes";

const defaultMessages = [];
export default (state = { chatMessages: [], conversations: [], userConversations:[], newMessage: {} }, action) => {
    switch (action.type) {
      case ALL_MESSAGES_IN_CONVERSATION:
        {
          return { ...state, chatMessages: action.payload };
        }
      case SEND_MESSAGE:
        {
          return {...state, chatMessages: [...state.chatMessages, action.payload]}
        } 
        case REGISTER_USER_IN_CHAT:
            return state;
        case FETCH_USERS_BY_ID:
        {
            return {...state, conversations: action.payload}
        } 
        case USERS_CONVERSATIONS:
          {
              return {...state, userConversations: action.payload}
          } 
          case CREATE_CONVERSATION:
        {
          return {...state, userConversations: [...state.userConversations, action.payload]}
        } 
      default:
        return state;
    }
};