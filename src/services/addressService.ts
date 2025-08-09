import api from './api';
import type { ApiResponse } from '@/types';
import type { Address, AddressRequest } from '@/types/address';

const ADDRESS_URL = '/addresses';

export const addressService = {
  getAll: async (): Promise<Address[]> => {
    const res = await api.get<ApiResponse<Address[]>>(ADDRESS_URL);
    return res.data.data;
  },
  create: async (payload: AddressRequest): Promise<Address> => {
    const res = await api.post<ApiResponse<Address>>(ADDRESS_URL, payload);
    return res.data.data;
  },
  update: async (id: number, payload: AddressRequest): Promise<Address> => {
    const res = await api.put<ApiResponse<Address>>(`${ADDRESS_URL}/${id}`, payload);
    return res.data.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`${ADDRESS_URL}/${id}`);
  }
};