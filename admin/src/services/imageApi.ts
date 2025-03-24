import axios from 'axios';
import { ImageFile } from '../types/image';
import { API_URL } from './config';



const imageApi = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const imageService = {
  uploadImages: async (files: File[]): Promise<ImageFile[]> => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await imageApi.post<ImageFile[]>('/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw new Error('Failed to upload images');
    }
  },

  getAllImages: async (): Promise<ImageFile[]> => {
    try {
      const response = await imageApi.get<ImageFile[]>('/images');
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch images');
    }
  },

  deleteImage: async (imageName: string): Promise<void> => {
    try {
      await imageApi.delete(`/images/${imageName}`);
    } catch (error) {
      console.error('Delete Error:', error);
      throw new Error('Failed to delete image');
    }
  },
};