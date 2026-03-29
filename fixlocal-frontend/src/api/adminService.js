
import axios from "./axios";

const PAGE_SIZE = 10;

export const adminService = {
  getStats: () => axios.get("/admin/stats"),
  getUsers: (page = 0) => axios.get(`/admin/users?page=${page}&size=${PAGE_SIZE}`),
  getTradespersons: (page = 0) =>
    axios.get(`/admin/trades?page=${page}&size=${PAGE_SIZE}`),
  blockUser: (userId) => axios.patch(`/admin/users/${userId}/block`),
  unblockUser: (userId) => axios.patch(`/admin/users/${userId}/unblock`),
  getDisputes: () => axios.get("/disputes"),
  getDisputeById: (id) => axios.get(`/disputes/${id}`),
  updateDispute: (id, data) => axios.put(`/disputes/${id}`, data),
  addDisputeNote: (id, payload) => axios.post(`/disputes/${id}/messages`, payload),
};

export const getAdminStats = () => adminService.getStats();
export const getAllDisputes = () => adminService.getDisputes();
export const updateDispute = (id, data) => adminService.updateDispute(id, data);
