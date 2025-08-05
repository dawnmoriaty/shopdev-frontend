// src/services/api.ts
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Adjust nếu cần (e.g., env var)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor để handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data?.message || 'Something went wrong');
    return Promise.reject(error);
  }
);

// Category APIs
export const getAllCategories = () => api.get('/categories').then(res => res.data.data);
export const createCategory = (data: unknown) => api.post('/categories', data).then(res => res.data.data);
export const getCategoryById = (id: number) => api.get(`/categories/${id}`).then(res => res.data.data);
export const updateCategory = (id: number, data: unknown) => api.put(`/categories/${id}`, data).then(res => res.data.data);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);
export const updateCategoryStatus = (id: number, status: boolean) => api.patch(`/categories/${id}/status`, { status }).then(res => res.data.data);

// Product APIs
export const getAllProducts = () => api.get('/products').then(res => res.data.data);
export const createProduct = (data: unknown) => api.post('/products', data).then(res => res.data.data);
export const getProductById = (id: number) => api.get(`/products/${id}`).then(res => res.data.data);
export const updateProduct = (id: number, data: unknown) => api.put(`/products/${id}`, data).then(res => res.data.data);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// Image Upload
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data.imageUrl);
};