import type { CartItem, CartItemRequest } from "@/types/cart";
import api from "./api";
import type { ApiResponse } from "@/types";

const CART_URL = '/cart';

export const cartService = {
  // Lấy tất cả sản phẩm trong giỏ hàng
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get<ApiResponse<CartItem[]>>(CART_URL);
    return response.data.data;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (cartItem: CartItemRequest): Promise<CartItem> => {
    const response = await api.post<ApiResponse<CartItem>>(`${CART_URL}/add`, cartItem);
    return response.data.data;
  },

  // Cập nhật số lượng sản phẩm
  updateCartItem: async (cartItemId: number, request: { quantity: number }): Promise<CartItem> => {
    const response = await api.put<ApiResponse<CartItem>>(`${CART_URL}/${cartItemId}`, request);
    return response.data.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  deleteCartItem: async (cartItemId: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${CART_URL}/${cartItemId}`);
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${CART_URL}/clear`);
  },

  // Thanh toán giỏ hàng
  checkout: async (payload: { addressId: number; paymentMethod: 'COD' | 'VNPAY' | 'MOMO'; note?: string }): Promise<void> => {
    await api.post<ApiResponse<void>>(`${CART_URL}/checkout`, payload);
  }
};