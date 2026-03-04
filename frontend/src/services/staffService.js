import api from './api';

export const staffService = {
    getAllStaff: async () => {
        const response = await api.get('/staff');
        return response.data;
    },
    addStaff: async (staffData) => {
        const response = await api.post('/staff', staffData);
        return response.data;
    },
    getStaffByFlat: async (flatId) => {
        const response = await api.get(`/staff/flat/${flatId}`);
        return response.data;
    },
    deleteStaff: async (staffId) => {
        await api.delete(`/staff/${staffId}`);
    },
    linkStaffToFlat: async (staffId, flatId) => {
        await api.post(`/staff/${staffId}/link-flat/${flatId}`);
    },
    unlinkStaffFromFlat: async (staffId, flatId) => {
        await api.delete(`/staff/${staffId}/unlink-flat/${flatId}`);
    },
    scanPassCode: async (passCode) => {
        const response = await api.post(`/staff/scan?passCode=${passCode}`);
        return response.data;
    }
};
