import api from './api';

export const complaintService = {
    // Create a new complaint
    createComplaint: async (data) => {
        // data: { title, description, category, priority }
        const response = await api.post('/complaints', data);
        return response.data;
    },

    // Get my complaints (Resident)
    getMyComplaints: async () => {
        const response = await api.get('/complaints/my');
        return response.data;
    },

    // Get all society complaints (Admin)
    getAllComplaints: async (societyId) => {
        const response = await api.get(`/complaints/society/${societyId}`);
        return response.data;
    },

    // Update complaint status
    updateStatus: async (complaintId, status) => {
        const response = await api.put(`/complaints/${complaintId}/status`, { status });
        return response.data;
    },

    // Get comments for a complaint
    getComments: async (complaintId) => {
        const response = await api.get(`/complaints/${complaintId}/comments`);
        return response.data;
    },

    // Add a comment/reply
    addComment: async (complaintId, comment) => {
        const response = await api.post(`/complaints/${complaintId}/comments`, { comment });
        return response.data;
    }
};
