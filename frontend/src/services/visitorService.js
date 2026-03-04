import api from './api';

export const visitorService = {
    checkIn: async (data) => {
        const response = await api.post('/visitors/check-in', data);
        return response.data;
    },
    checkOut: async (logId) => {
        const response = await api.post(`/visitors/check-out/${logId}`);
        return response.data;
    },
    getActiveVisitors: async (societyId = null) => {
        const params = societyId ? { societyId } : {};
        const response = await api.get('/visitors/active', { params });
        return response.data;
    },
    getVisitorHistory: async (societyId = null) => {
        const params = societyId ? { societyId } : {};
        const response = await api.get('/visitors/history', { params });
        return response.data;
    },
    getVisitorsByFlat: async (flatId) => {
        const response = await api.get(`/visitors/flat/${flatId}`);
        return response.data;
    },
    searchVisitors: async (societyId, name = null, phone = null) => {
        const params = { societyId };
        if (name) params.name = name;
        if (phone) params.phone = phone;
        const response = await api.get('/visitors/search', { params });
        return response.data;
    },
    filterByCategory: async (societyId, category) => {
        const response = await api.get('/visitors/filter', {
            params: { societyId, category }
        });
        return response.data;
    },
    filterByDateRange: async (societyId, startDate, endDate) => {
        const response = await api.get('/visitors/filter', {
            params: { societyId, startDate, endDate }
        });
        return response.data;
    },
    getOverstayingVisitors: async (societyId) => {
        const response = await api.get('/visitors/overstaying', {
            params: { societyId }
        });
        return response.data;
    },
    getPendingApprovals: async (residentId) => {
        const response = await api.get(`/visitors/pending-approvals/${residentId}`);
        return response.data;
    },
    createPreApproval: async (data) => {
        const response = await api.post('/visitors/pre-approve', data);
        return response.data;
    },
    getVisitorLog: async (logId) => {
        const response = await api.get(`/visitors/${logId}`);
        return response.data;
    },
    approve: async (logId) => {
        const response = await api.post(`/visitors/${logId}/approve`);
        return response.data;
    },
    reject: async (logId) => {
        const response = await api.post(`/visitors/${logId}/reject`);
        return response.data;
    },
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
