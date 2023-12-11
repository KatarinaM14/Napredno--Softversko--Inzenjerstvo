import axios from 'axios';

const API = axios.create({ baseURL: 'https://localhost:44318/' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  
  return req;
});

  export const signIn = (formData) => API.post(`/User/LogIn`, formData);
  export const signUp = (formData) => API.post(`/User/Register`, formData);

  export const fetchPosts = (id) => API.get(`/Post/GetPosts/${id}`);
  export const createPost = (newPost) => API.post('/Post/CreatePost',newPost);
  export const likePost = (postId, userId) => API.post(`/Post/LikePost/${postId}`, userId);
  export const dislikePost = (postId, userId) => API.post(`/Post/DislikePost/${postId}`, userId);
  export const commentPost = (comment) => API.post(`/Comment/AddComment`, comment);
  export const GetPostsOfUserAndHisFollowings = (id) => API.get(`/Post/GetPostsOfUserAndHisFollowings/${id}`);
  export const GetPostsOfNotFollowingUsers = (id) => API.get(`/Post/GetPostsOfNotFollowingUsers/${id}`);
  export const GetStoriesOfUserAndHisFollowings = (id) => API.get(`/Story/GetStoriesOfUserAndHisFollowings/${id}`);
  export const GetLatestStory = (id) => API.get(`/Story/GetLatestStory/${id}`);
  export const createStory = (newStory) => API.post('/Story/CreateStory',newStory);
  export const GetUsersForFollow = (id) => API.get(`/User/GetUsersForFollow/${id}`);
  export const followUser = (currentUser, followedUserId) => API.post(`/User/FollowUser/${followedUserId}`, currentUser);
  export const unfollowUser = (currentUser, followedUserId) => API.post(`/User/UnfollowUser/${followedUserId}`, currentUser);
  export const getFollowers =  (id) => API.get(`/User/GetFollowers/${id}`);
  export const getFollowing = (id) => API.get(`/User/GetFollowing/${id}`);
  export const fetchUser = (id) => API.get(`/User/GetUser/${id}`); 
  export const updateUser = (user) => API.put('/User/UpdateUser',user);
  export const registerUser = (user) => API.post('/Chat/RegisterUser', user);
  export const getUsersById = (usersIds) => API.post(`/User/GetUsersById`, usersIds);
  export const getConversations =  (id) => API.get(`/Conversation/GetConversationsOfUser/${id}`);
  export const getMessagesInConversations =  (id) => API.get(`/Message/GetMessagesInConversation/${id}`);
  export const createMessage = (message) => API.post('/Message/CreateMessage',message);
  export const updatePost = (post, newDescription) => API.put(`/Post/UpdatePostDescription/${newDescription}`,post);
  export const deletePost = (post , userId) => API.delete(`/Post/DeletePost/${userId}`,  post);
  export const deleteUser = (id) => API.delete(`/User/DeleteUser/${id}`);
  export const fetchUsers=()=>API.get('/User/GetUsers');
  export const createConversation = (members) => API.post('/Conversation/CreateConversation',members);
