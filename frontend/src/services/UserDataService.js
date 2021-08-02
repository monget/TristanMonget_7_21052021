import http from "../http-common";

class UserDataService {
  find(id) {
    return http.get(`/auth/profil/${id}`);
  }

  update(id, data) {
    return http.put(`/auth/profil/${id}`, data);
  }

  delete(id) {
    return http.delete(`/auth/profil/${id}`);
  }
}

export default new UserDataService();