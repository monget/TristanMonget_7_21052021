import axios from "axios"
import router from './router'
import store from './store'

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {"Content-type": "application/json"}
})

http.interceptors.request.use(function (config) {
  if (localStorage.user) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
  }
  return config;
}, function (error) {
  console.log(error)
  return Promise.reject(error);
});

http.interceptors.response.use(function (response) {
  return response;
},function (e) {
  if (e.response.status === 401) {
    store.dispatch('auth/logout');
    alert("Vous n'êtes plus connecté !")
    router.push('/connection');
  }
  else if (e.response.status === 404) {
    router.push('/404')
  }
  return Promise.reject(e)
});

export default http;