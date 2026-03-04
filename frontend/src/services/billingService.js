import api from './api';

export const billingService = {
    getAllBills: async () => {
        const response = await api.get('/billing');
        return response.data;
    },

    getMyBills: async () => {
        const response = await api.get('/billing/my');
        return response.data;
    },

    generateBills: async (ratePerSqFt) => {
        const response = await api.post('/billing/generate', { ratePerSqFt });
        return response.data;
    },

    markAsPaid: async (id) => {
        const response = await api.put(`/billing/${id}/pay`);
        return response.data;
    },

    payOnline: async (id) => {
        const response = await api.post(`/billing/${id}/pay-online`);
        return response.data;
    }
};
