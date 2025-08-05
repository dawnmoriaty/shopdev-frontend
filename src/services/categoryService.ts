import type { Category, CategoryRequest } from '@/types/category';
import api from './api';
import type { ApiResponse } from '@/types';

const CATEGORY_URL = '/categories';

export const categoryService = {
  // Lấy tất cả danh mục
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<ApiResponse<Category[]>>(CATEGORY_URL);
      console.log('API Response:', response.data); // Kiểm tra dữ liệu
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`${CATEGORY_URL}/${id}`);
    return response.data.data;
  },

  // Thêm danh mục mới
  createCategory: async (category: CategoryRequest): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>(CATEGORY_URL, category);
    return response.data.data;
  },

  // Cập nhật danh mục
  updateCategory: async (id: number, category: CategoryRequest): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`${CATEGORY_URL}/${id}`, category);
    return response.data.data;
  },

  // Xóa danh mục
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${CATEGORY_URL}/${id}`);
  },

  // Cập nhật trạng thái danh mục
  updateCategoryStatus: async (id: number, status: boolean): Promise<Category> => {
    const response = await api.patch<ApiResponse<Category>>(`${CATEGORY_URL}/${id}/status`, { status });
    return response.data.data;
  }
};