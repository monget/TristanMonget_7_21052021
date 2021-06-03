import http from "../http-common";

class UserDataService {
  create(data) {
    return http.post("/auth/signup", data);
  }

  find(data) {
    return http.post("/auth/login", data); //post ??
  }

  update(id, data) {
    return http.put(`/***/${id}`, data);
  }

  delete(id) {
    return http.delete(`/***/${id}`);
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new UserDataService();