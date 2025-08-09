import api from './api';
import type { ApiResponse } from '@/types';
import type { Order, OrderStatus } from '@/types/order';

const USER_BASE = '/user/history';
const ADMIN_BASE = '/admin/orders';

export const orderService = {
  // User
  getUserOrders: async (): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>(USER_BASE);
    return res.data.data;
  },
  getUserOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>(`${USER_BASE}/status/${status}`);
    return res.data.data;
  },
  getUserOrderBySerial: async (serial: string): Promise<Order> => {
    const res = await api.get<ApiResponse<Order>>(`${USER_BASE}/${serial}`);
    return res.data.data;
  },
  cancelUserOrder: async (orderId: number): Promise<void> => {
    await api.put<ApiResponse<void>>(`${USER_BASE}/${orderId}/cancel`);
  },

  // Admin
  getAllAdminOrders: async (): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>(ADMIN_BASE);
    return res.data.data;
  },
  getAdminOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const res = await api.get<ApiResponse<Order[]>>(`${ADMIN_BASE}/status/${status}`);
    return res.data.data;
  },
  getAdminOrderById: async (orderId: number): Promise<Order> => {
    const res = await api.get<ApiResponse<Order>>(`${ADMIN_BASE}/${orderId}`);
    return res.data.data;
  },
  updateAdminOrderStatus: async (orderId: number, newStatus: OrderStatus): Promise<Order> => {
    const res = await api.put<ApiResponse<Order>>(`${ADMIN_BASE}/${orderId}/status`, {
      orderStatus: newStatus
    });
    return res.data.data;
  }
};