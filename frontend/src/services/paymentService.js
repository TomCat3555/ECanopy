import api from './api';

export const paymentService = {
    createOrder: async (billId, userId) => {
        const response = await api.post('/payments/create-order', { billId, userId });
        return response.data;
    },
    verifyPayment: async (paymentData) => {
        // paymentData: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    }
};
