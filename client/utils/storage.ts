import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UserData = {
  name: string;
  phone: string;
};

const USER_DATA_KEY = 'user_data';

// Web implementation using localStorage
const webStorage = {
  setItemAsync: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  getItemAsync: async (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
};

// Use appropriate storage based on platform
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

export async function saveUserData(data: UserData) {
  try {
    await storage.setItemAsync(USER_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

export async function getUserData(): Promise<UserData | null> {
  try {
    const data = await storage.getItemAsync(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}