import http from "../http-common";

class UserDataService {
  signup(data) {
    return http.post("/auth/signup", data);
  }

  login(data) {
    return http.post("/auth/login", data);
  }

  find(id) {
    return http.get(`/auth/profil/${id}`);
  }

  update(id, data) {
    return http.put(`/auth/profil/${id}`, data);
  }

  delete(id) {
    return http.delete(`/auth/profil/${id}`);
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new UserDataService();