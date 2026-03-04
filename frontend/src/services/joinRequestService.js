import api from './api';

export const joinRequestService = {
    // Submit a new join request
    submitRequest: async (data) => {
        // data: { flatId, residentType, deedDocumentUrl }
        const response = await api.post('/join-requests', data);
        return response.data;
    },

    // Get pending requests (Secretary view)
    getPendingRequests: async (societyId) => {
        const response = await api.get(`/join-requests/society/${societyId}/pending`);
        return response.data;
    },

    // Update request status (Approve/Reject)
    updateStatus: async (requestId, status) => {
        // status: 'APPROVED' | 'REJECTED'
        const response = await api.put(`/join-requests/${requestId}/status`, { status });
        return response.data;
    },

    // Get user's own requests
    getUserRequests: async () => {
        const response = await api.get('/join-requests/my-requests');
        return response.data;
    }
};
