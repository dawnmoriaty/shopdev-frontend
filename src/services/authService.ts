import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';
import api from './api';

// Interceptor để thêm token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{data: AuthResponse}>('/auth/login', credentials);
    // Lưu token vào localStorage
    localStorage.setItem('token', response.data.data.access_token);
    return response.data.data;
  },

  // Đăng ký
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{data: AuthResponse}>('/auth/register', userData);
    // Lưu token vào localStorage
    localStorage.setItem('token', response.data.data.access_token);
    return response.data.data;
  },

  // Đăng xuất
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
  },
};