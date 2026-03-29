import api from "./axios";

const testimonialApi = {
  list(limit = 6) {
    return api.get(`/testimonials?limit=${limit}`);
  },
  submit(payload) {
    return api.post("/testimonials", payload);
  },
};

export default testimonialApi;