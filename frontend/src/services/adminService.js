import api from './api';

export const adminService = {
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard-stats');
        return response.data;
    },
    updateUserRole: async (userId, roleName) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role: roleName });
        return response.data;
    },
    createSecurityGuard: async (data) => {
        const response = await api.post('/admin/create-guard', data);
        return response.data;
    }
};
