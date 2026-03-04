import api from './api';

export const marketplaceService = {
    getAllItems: async () => {
        const response = await api.get('/items');
        return response.data;
    },

    uploadItem: async (formData) => {
        // formData should contain: itemName, description, minPrice, maxPrice, negotiable, sellerId, category, image, video
        const response = await api.post('/items/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteItem: async (itemId) => {
        const response = await api.delete(`/items/${itemId}`);
        return response.data;
    }
};
