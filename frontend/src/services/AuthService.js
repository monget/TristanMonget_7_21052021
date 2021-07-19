import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  async login(user) {
    const response = await axios.post(API_URL + 'login', user);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }
  logout() {
    localStorage.removeItem('user');
  }
  async signup(user) {
    const response = await axios.post(API_URL + 'signup', user);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }
}

export default new AuthService();