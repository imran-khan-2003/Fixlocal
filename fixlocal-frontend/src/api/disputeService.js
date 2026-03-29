import api from "./axios";

export const disputeService = {
  create: (payload) => api.post("/disputes", payload),
  listForBooking: (bookingId) => api.get(`/disputes/booking/${bookingId}`),
  listMine: () => api.get("/disputes/mine"),
  addMessage: (disputeId, payload) =>
    api.post(`/disputes/${disputeId}/messages`, payload),
};

export default disputeService;