import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  Movie,
  Branch,
  MenuItem,
  News,
  BookingRequest,
  Booking,
  User,
  Notification,
  Gift,
} from './types';

// Auth Services
export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.LOGIN, data),

  logout: () =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.LOGOUT),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>(API_ENDPOINTS.PROFILE),
};

// Movie Services
export const movieService = {
  getMovies: () =>
    apiClient.get<Movie[]>(API_ENDPOINTS.MOVIES),

  getMovie: (id: string) =>
    apiClient.get<Movie>(API_ENDPOINTS.MOVIE_DETAILS(id)),
};

// Branch Services
export const branchService = {
  getBranches: () =>
    apiClient.get<Branch[]>(API_ENDPOINTS.BRANCHES),

  getBranch: (id: string) =>
    apiClient.get<Branch>(API_ENDPOINTS.BRANCH_DETAILS(id)),
};

// Menu Services
export const menuService = {
  getMenuItems: () =>
    apiClient.get<MenuItem[]>(API_ENDPOINTS.MENU_ITEMS),

  getMenuCategories: () =>
    apiClient.get<string[]>(API_ENDPOINTS.MENU_CATEGORIES),
};

// News Services
export const newsService = {
  getNews: () =>
    apiClient.get<News[]>(API_ENDPOINTS.NEWS),

  getNewsItem: (id: string) =>
    apiClient.get<News>(API_ENDPOINTS.NEWS_DETAILS(id)),
};

// Booking Services
export const bookingService = {
  createBooking: (data: BookingRequest) =>
    apiClient.post<Booking>(API_ENDPOINTS.BOOKINGS, data),

  getBookings: () =>
    apiClient.get<Booking[]>(API_ENDPOINTS.BOOKINGS),

  getUserBookings: (userId: string) =>
    apiClient.get<Booking[]>(API_ENDPOINTS.USER_BOOKINGS(userId)),

  getBooking: (id: number) =>
    apiClient.get<Booking>(API_ENDPOINTS.BOOKING_DETAILS(id)),

  cancelBooking: (id: number) =>
    apiClient.delete<null>(API_ENDPOINTS.BOOKING_DETAILS(id)),
};

// Notification Services
export const notificationService = {
  getUserNotifications: (userId: string) =>
    apiClient.get<Notification[]>(API_ENDPOINTS.USER_NOTIFICATIONS(userId)),
};

// Gift Services
export const giftService = {
  getUserGifts: (userId: string) =>
    apiClient.get<Gift[]>(API_ENDPOINTS.USER_GIFTS(userId)),
};