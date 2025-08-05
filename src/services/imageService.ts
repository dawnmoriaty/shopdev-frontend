import type { ApiResponse } from '@/types';
import api from './api';


interface ImageResponse {
  imageUrl: string;
}

export const imageService = {
  uploadImage: async (file: File): Promise<string> => {
    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API upload ảnh
      const response = await api.post<ApiResponse<ImageResponse>>(
        '/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Upload response:', response.data);
      
      // Trả về URL ảnh từ response
      return response.data.data.imageUrl;
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      throw error;
    }
  },
};