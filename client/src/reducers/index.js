import { combineReducers } from "redux";

import posts from './posts';
import auth from './auth';
import stories from "./stories";
import chat from "./chat";

export default combineReducers({ auth, posts, stories, chat});