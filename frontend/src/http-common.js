import axios from "axios"
import router from './router'
import store from './store'

function authHeader() {
  if (localStorage.user) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user.token) {
      return { Authorization: 'Bearer ' + user.token };
    }
    else {
      return {}
    }
  }
}

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: authHeader(), "Content-type": "application/json"
})

http.interceptors.response.use(function (response) {
  return response
}, function (e) {
  if (e.response.status === 401) {
    store.dispatch('auth/logout');
    router.push('/connection');
  }
  else if (e.response.status === 404) {
    router.push('/404')
  }
  return Promise.reject(e)
})

export default http;