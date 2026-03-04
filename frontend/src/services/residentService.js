import api from './api';

export const residentService = {
    getDashboardStats: async () => {
        const response = await api.get('/resident/dashboard-stats');
        return response.data;
    }
};
