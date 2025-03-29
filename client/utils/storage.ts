import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Custom UUID generation that works in all environments
function generateUUID() {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

type UserData = {
  id: string;
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
const storage = SecureStore;

export async function saveUserData(data: Omit<UserData, 'id'>) {
  try {
    // Get existing data first
    const existingData = await getUserData();
    const userId = existingData?.id || generateUUID(); // Generate new UUID only if it doesn't exist

    const updatedData = {
      id: userId,
      ...data
    };

    await storage.setItemAsync(USER_DATA_KEY, JSON.stringify(updatedData));
    return userId;
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