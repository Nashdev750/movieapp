import axios from 'axios';
import { Menu } from '../types/menu';
import { API_URL } from './config';


const menuApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuService = {
  getAllMenuItems: async (): Promise<Menu[]> => {
    try {
      const response = await menuApi.get<Menu[]>('/menus');
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch menu items');
    }
  },

  getMenuItem: async (id: string): Promise<Menu> => {
    try {
      const response = await menuApi.get<Menu>(`/menus/${id}`);
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch menu item details');
    }
  },

  createMenuItem: async (menuItem: Omit<Menu, '_id'>): Promise<Menu> => {
    try {
      const response = await menuApi.post<Menu>('/menus', menuItem);
      return response.data;
    } catch (error) {
      console.error('Create Error:', error);
      throw new Error('Failed to create menu item');
    }
  },

  updateMenuItem: async (id: string, menuItem: Partial<Menu>): Promise<Menu> => {
    try {
      const response = await menuApi.put<Menu>(`/menus/${id}`, menuItem);
      return response.data;
    } catch (error) {
      console.error('Update Error:', error);
      throw new Error('Failed to update menu item');
    }
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    try {
      await menuApi.delete(`/menus/${id}`);
    } catch (error) {
      console.error('Delete Error:', error);
      throw new Error('Failed to delete menu item');
    }
  },
};