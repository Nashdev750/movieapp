import Constants from 'expo-constants';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://genz-panel.space/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',

  // Movies
  MOVIES: '/movies',
  MOVIE_DETAILS: (id: string) => `/movies/${id}`,

  // Branches
  BRANCHES: '/branches',
  BRANCH_DETAILS: (id: string) => `/branches/${id}`,

  // Menu
  MENU_ITEMS: '/menus',
  MENU_CATEGORIES: '/menu/categories',

  // News
  NEWS: '/news',
  NEWS_DETAILS: (id: string) => `/news/${id}`,

  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_DETAILS: (id: number) => `/bookings/${id}`,
  USER_BOOKINGS: (userId: string) => `/bookings/user/${userId}`,

  // Notifications
  USER_NOTIFICATIONS: (userId: string) => `/notifications/user/${userId}`,

  // Gifts
  USER_GIFTS: (userId: string) => `/gifts/user/${userId}`,
} as const;