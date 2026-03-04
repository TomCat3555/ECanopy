import api from './api';

export const accessService = {
    validateQr: async (token) => {
        const response = await api.post('/access/validate-qr', { token });
        return response.data;
    }
};
