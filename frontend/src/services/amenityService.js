import api from './api';

export const amenityService = {
    getAllAmenities: async () => {
        const response = await api.get('/amenities');
        return response.data;
    },
    getAllBookings: async () => { // For Admin/Secretary
        const response = await api.get('/amenities/bookings');
        return response.data;
    },
    getMyBookings: async () => {
        const response = await api.get('/amenities/my-bookings');
        return response.data;
    },
    addAmenity: async (data) => {
        const response = await api.post('/amenities', data);
        return response.data;
    },
    updateAmenity: async (id, data) => {
        const response = await api.put(`/amenities/${id}`, data);
        return response.data;
    },
    deleteAmenity: async (id) => {
        await api.delete(`/amenities/${id}`);
    },
    bookAmenity: async (amenityId, userId, payload) => {
        const response = await api.post(`/amenities/${amenityId}/book?userId=${userId}`, payload);
        return response.data;
    },
    updateBookingStatus: async (bookingId, status) => {
        const response = await api.patch(`/amenities/bookings/${bookingId}?status=${status}`);
        return response.data;
    }
};
