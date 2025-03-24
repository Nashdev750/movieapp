import axios from 'axios';
import { Movie } from '../types/movie';
import { API_URL } from './config';


// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  getMovies: async () => {
    try {
      const response = await axiosInstance.get<Movie[]>('/movies');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch movies. Please check if the API server is running.');
    }
  },

  getMovie: async (id: string) => {
    try {
      const response = await axiosInstance.get<Movie>(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch movie details.');
    }
  },

  createMovie: async (movie: Omit<Movie, '_id'>) => {
    try {
      const response = await axiosInstance.post<Movie>('/movies', movie);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to create movie.');
    }
  },

  updateMovie: async (id: string, movie: Partial<Movie>) => {
    try {
      const response = await axiosInstance.put<Movie>(`/movies/${id}`, movie);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to update movie.');
    }
  },

  deleteMovie: async (id: string) => {
    try {
      await axiosInstance.delete(`/movies/${id}`);
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to delete movie.');
    }
  }
};