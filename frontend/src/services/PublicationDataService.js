import http from "../http-common";

class PublicationDataService {
  create(data) {
    return http.post("/publications", data);
  }

  update(id, data) {
    return http.put(`/publications/${id}`, data);
  }

  delete(id) {
    return http.delete(`/publications/${id}`);
  }

  findOne(id) {
    return http.get(`/publications/${id}`);
  }

  findAll() {
    return http.get("/publications");
  }

  like(id, data) {
    return http.post(`/publications/${id}/like`, data);
  }
}

export default new PublicationDataService();