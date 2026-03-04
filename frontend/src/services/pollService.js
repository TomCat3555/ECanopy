import api from './api';

export const pollService = {
    getActivePolls: async (societyId) => {
        const response = await api.get(`/polls/society/${societyId}`);
        return response.data;
    },
    createPoll: async (data) => {
        const response = await api.post('/polls', data);
        return response.data;
    },
    vote: async (pollId, userId, option) => {
        const response = await api.post(`/polls/${pollId}/vote?userId=${userId}`, { option });
        return response.data;
    },
    deletePoll: async (pollId) => {
        await api.delete(`/polls/${pollId}`);
    }
};
