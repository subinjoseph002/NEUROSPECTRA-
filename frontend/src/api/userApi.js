import api from './axios';

export const userApi = {
  getUsers: async (role = '') => {
    const params = role && role !== 'All' ? { role } : {};
    const response = await api.get('/auth/users/', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/auth/users/${id}/`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/auth/users/', userData);
    return response.data;
  },

  updateUser: async (id, updates) => {
    const response = await api.patch(`/auth/users/${id}/`, updates);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}/`);
    return response.data;
  },
};
