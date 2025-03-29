// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Movie Types
export interface Movie {
  _id: string;
  title: string;
  description: string;
  image: string;
  trailerUrl?: string;
  genre?: string;
  duration?: number;
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Branch Types
export interface Branch {
  _id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
  images: string[];
  contact?: {
    phone?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Menu Types
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// News Types
export interface News {
  _id: string;
  title: string;
  image: string;
  date: string;
  description: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface BookingRequest {
  userid: string;
  branchName: string;
  date: string;
  time: string;
  fullName: string;
  phoneNumber: string;
  status: number;
}

export interface Booking {
  _id: string;
  userId: string;
  branchId: string;
  date: string;
  time: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: 'promo' | 'booking' | 'event' | 'reward';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Gift Types
export interface Gift {
  _id: string;
  userId: string;
  code: string;
  type: string;
  discount: number;
  description: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}