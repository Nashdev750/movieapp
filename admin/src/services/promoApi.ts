import axios from 'axios';
import { PromoCode } from '../types/promo';

const API_URL = 'http://localhost:5000/promos';

const promoApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const promoService = {
  validatePromoCode: async (code: string): Promise<PromoCode> => {
    try {
      const response = await promoApi.post<PromoCode>('/validate', { code });
      return response.data;
    } catch (error) {
      console.error('Validation Error:', error);
      throw new Error('Invalid promo code');
    }
  },
};