import api from './api';

export const societyService = {
    createSociety: async (data) => {
        const response = await api.post('/societies', data);
        return response.data;
    },
    getAllSocieties: async () => {
        const response = await api.get('/societies');
        return response.data;
    },
    getSociety: async (id) => {
        const response = await api.get(`/societies/${id}`);
        return response.data;
    },
    addBuilding: async (societyId, data) => {
        const response = await api.post(`/societies/${societyId}/buildings`, data);
        return response.data;
    },
    getBuildings: async (societyId) => {
        const response = await api.get(`/societies/${societyId}/buildings`);
        return response.data;
    },
    addFlat: async (buildingId, data) => {
        const response = await api.post(`/societies/buildings/${buildingId}/flats`, data);
        return response.data;
    },
    getFlats: async (buildingId) => {
        const response = await api.get(`/societies/buildings/${buildingId}/flats`);
        return response.data;
    }
};
