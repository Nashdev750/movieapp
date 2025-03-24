import axios from 'axios';
import { Branch } from '../types/branch';
import { API_URL } from './config';


const branchApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const branchService = {
  getAllBranches: async (): Promise<Branch[]> => {
    try {
      const response = await branchApi.get<Branch[]>('/branches');
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch branches');
    }
  },

  getBranch: async (id: string): Promise<Branch> => {
    try {
      const response = await branchApi.get<Branch>(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw new Error('Failed to fetch branch details');
    }
  },

  createBranch: async (branch: Omit<Branch, '_id'>): Promise<Branch> => {
    try {
      const response = await branchApi.post<Branch>('/branches', branch);
      return response.data;
    } catch (error) {
      console.error('Create Error:', error);
      throw new Error('Failed to create branch');
    }
  },

  updateBranch: async (id: string, branch: Partial<Branch>): Promise<Branch> => {
    try {
      const response = await branchApi.put<Branch>(`/branches/${id}`, branch);
      return response.data;
    } catch (error) {
      console.error('Update Error:', error);
      throw new Error('Failed to update branch');
    }
  },

  deleteBranch: async (id: string): Promise<void> => {
    try {
      await branchApi.delete(`/branches/${id}`);
    } catch (error) {
      console.error('Delete Error:', error);
      throw new Error('Failed to delete branch');
    }
  },
};