import api from './api';

export const noticeService = {
    createNotice: async (societyId, data) => {
        const response = await api.post(`/notices/society/${societyId}`, data);
        return response.data;
    },
    getNotices: async (societyId) => {
        const response = await api.get(`/notices/society/${societyId}`);
        return response.data;
    },
    deleteNotice: async (noticeId) => {
        await api.delete(`/notices/${noticeId}`);
    }
};
