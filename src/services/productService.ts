import type { Product, ProductRequest } from '@/types/product';
import api from './api';
import type { ApiResponse } from '@/types';


const PRODUCT_URL = '/products';

export const productService = {
  // Lấy tất cả sản phẩm
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>(PRODUCT_URL);
      console.log('API Response Products:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`${PRODUCT_URL}/${id}`);
    return response.data.data;
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategoryId: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`${PRODUCT_URL}/category/${categoryId}`);
    return response.data.data;
  },

  // Thêm sản phẩm mới
  createProduct: async (product: ProductRequest): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>(PRODUCT_URL, product);
    return response.data.data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: number, product: ProductRequest): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`${PRODUCT_URL}/${id}`, product);
    return response.data.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${PRODUCT_URL}/${id}`);
  }
};