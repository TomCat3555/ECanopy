import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5138/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, fullName) => api.post('/auth/register', { email, password, fullName }),
  me: () => api.get('/auth/me'),
};

export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  track: (ticketNumber) => api.get(`/complaints/track/${ticketNumber}`),
  addComment: (ticketNumber, commentText) => api.post(`/complaints/track/${ticketNumber}/comments`, { commentText }),
  updateStatus: (ticketNumber, status) => api.put(`/complaints/track/${ticketNumber}/status`, status),
  delete: (ticketNumber) => api.delete(`/complaints/track/${ticketNumber}`),
  getAnalytics: () => api.get('/complaints/analytics'),
};

export const societyAPI = {
  getAll: () => api.get('/societies'),
  create: (data) => api.post('/societies', data),
};

export const buildingAPI = {
  create: (data) => api.post('/buildings', data),
};

export const flatAPI = {
  create: (data) => api.post('/flats', data),
};

export const noticeAPI = {
  getAll: () => api.get('/notices'),
  create: (data) => api.post('/notices', data),
};

export const paymentAPI = {
  getAll: () => api.get('/payments'),
  create: (data) => api.post('/payments', data),
  getMy: () => api.get('/payments/my'),
};

export const maintainanceAPI = {
  getAll: () => api.get('/bills'),
  create: (data) => api.post('/bills', data),
  getMy: () => api.get('/bills/my'),
};

export const roleRequestAPI = {
  create: (data) => api.post('/role-requests', data),
  getMy: () => api.get('/role-requests/my'),
};

export const adminAPI = {
  getPendingRoleRequests: () => api.get('/admin/role-requests/pending'),
  approveRoleRequest: (data) => api.post('/admin/role-requests/approve', data),
  rejectRoleRequest: (data) => api.post('/admin/role-requests/reject', data),
};

export const rwaAPI = {
  getPendingJoinRequests: () => api.get('/rwa/resident-requests/pending'),
  approveJoinRequest: (data) => api.post('/rwa/resident-requests/approve', data),
  rejectJoinRequest: (data) => api.post('/rwa/resident-requests/reject', data),
};

export const residentAPI = {
  joinRequest: (data) => api.post('/join-requests', data),
  getAll: () => api.get('/residents'),
};

export const ownershipAPI = {
  request: () => api.post('/ownership/request'),
  approve: (requestId) => api.post(`/ownership/${requestId}/approve`),
  reject: (requestId) => api.post(`/ownership/${requestId}/reject`),
};

export default api;