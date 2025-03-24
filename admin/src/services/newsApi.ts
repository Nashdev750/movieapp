import axios from 'axios';
import { News } from '../types/news';
import { API_URL } from './config';



const newsApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsService = {
  getAllNews: async (): Promise<News[]> => {
    try {
      const response = await newsApi.get<News[]>('/news');
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch news');
    }
  },

  getNews: async (id: string): Promise<News> => {
    try {
      const response = await newsApi.get<News>(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch news details');
    }
  },

  createNews: async (news: Omit<News, '_id'>): Promise<News> => {
    try {
      const response = await newsApi.post<News>('/news', news);
      return response.data;
    } catch (error) {
      console.error('Create Error:', error);
      throw new Error('Failed to create news');
    }
  },

  updateNews: async (id: string, news: Partial<News>): Promise<News> => {
    try {
      const response = await newsApi.put<News>(`/news/${id}`, news);
      return response.data;
    } catch (error) {
      console.error('Update Error:', error);
      throw new Error('Failed to update news');
    }
  },

  deleteNews: async (id: string): Promise<void> => {
    try {
      await newsApi.delete(`/${id}`);
    } catch (error) {
      console.error('Delete Error:', error);
      throw new Error('Failed to delete news');
    }
  },
};