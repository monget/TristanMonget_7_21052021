import axios from "axios";

function authHeader() {
  if (localStorage.user) {
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (user.token) {
      return { Authorization: 'Bearer ' + user.token };
    }
    else {
      return {};
    }
  }
}

export default axios.create({
  baseURL: "http://localhost:3000/api",
  headers: authHeader(), "Content-type": "application/json"
});