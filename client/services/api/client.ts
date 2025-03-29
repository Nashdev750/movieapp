import { Platform } from 'react-native';
import { API_CONFIG } from './config';
import type { ApiErrorResponse } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ApiClient {
  private token: string | null = null;

  constructor(private baseURL: string) {}

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Platform': Platform.OS,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.message || 'An error occurred',
          response.status,
          errorData.errors
        );
      } else {
        throw new ApiError(
          'Invalid response format',
          response.status
        );
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(data)
      return data;
    }

    throw new ApiError(
      'Invalid response format',
      response.status
    );
  }

  private async retryRequest<T>(
    request: () => Promise<T>,
    attempts: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (
        attempts > 1 &&
        (error instanceof NetworkError || 
         (error instanceof ApiError && error.status >= 500))
      ) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY)
        );
        return this.retryRequest(request, attempts - 1);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    console.log(url)
    return this.retryRequest(async () => {
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
      } catch (error) {
        if (error instanceof TypeError) {
          throw new NetworkError('Network request failed');
        }
        throw error;
      }
    });
  }

  async post<T>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    return this.retryRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
      } catch (error) {
        if (error instanceof TypeError) {
          throw new NetworkError('Network request failed');
        }
        throw error;
      }
    });
  }

  async put<T>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    return this.retryRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
      } catch (error) {
        if (error instanceof TypeError) {
          throw new NetworkError('Network request failed');
        }
        throw error;
      }
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.retryRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
      } catch (error) {
        if (error instanceof TypeError) {
          throw new NetworkError('Network request failed');
        }
        throw error;
      }
    });
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL);