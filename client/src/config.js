import  axios  from "axios";
export default {
    axios: axios.create({
        baseURL: "https://localhost:44318/",
    
      })
}

axios.interceptors.request.use((req) => {
  if(localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});