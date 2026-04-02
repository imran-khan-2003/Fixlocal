import api from "./axios";

export const userService = {
  updateProfile: (payload) => api.put("/users/me", payload),
  deleteMyAccount: () => api.delete("/users/me"),
};

export default userService;