import http from "../http-common";

class CommentDataService {
  create(data) {
    return http.post("/comments", data);
  }

  update(id, data) {
    return http.put(`/comments/${id}`, data);
  }

  delete(id) {
    return http.delete(`/comments/${id}`);
  }

  like(id, data) {
    return http.post(`/comments/${id}/like`, data);
  }
}

export default new CommentDataService();