import axios from 'axios';
import { Booking } from '../types/booking';
import { API_URL } from './config';


const bookingApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const response = await bookingApi.get<Booking[]>('/bookings');
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch bookings');
    }
  },

  getBooking: async (id: string): Promise<Booking> => {
    try {
      const response = await bookingApi.get<Booking>(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch booking details');
    }
  },

  createBooking: async (booking: Omit<Booking, '_id'>): Promise<Booking> => {
    try {
      const response = await bookingApi.post<Booking>('/bookings', booking);
      return response.data;
    } catch (error) {
      console.error('Create Error:', error);
      throw new Error('Failed to create booking');
    }
  },

  updateBooking: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    try {
      const response = await bookingApi.put<Booking>(`/bookings/${id}`, booking);
      return response.data;
    } catch (error) {
      console.error('Update Error:', error);
      throw new Error('Failed to update booking');
    }
  },

  deleteBooking: async (id: string): Promise<void> => {
    try {
      await bookingApi.delete(`/bookings/${id}`);
    } catch (error) {
      console.error('Delete Error:', error);
      throw new Error('Failed to delete booking');
    }
  },
};