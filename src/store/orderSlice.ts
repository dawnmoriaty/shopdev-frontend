import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '@/services/orderService';
import type { Order, OrderStatus } from '@/types/order';

interface OrdersState {
  list: Order[];
  current?: Order;
  loading: boolean;
  error: string | null;
  filterStatus?: OrderStatus | 'ALL';
  adminList: Order[];
  adminLoading: boolean;
}

const initialState: OrdersState = {
  list: [],
  loading: false,
  error: null,
  adminList: [],
  adminLoading: false
};

// User thunks
export const fetchUserOrders = createAsyncThunk('orders/userAll', () => orderService.getUserOrders());
export const fetchUserOrdersByStatus = createAsyncThunk(
  'orders/userByStatus',
  (status: OrderStatus) => orderService.getUserOrdersByStatus(status)
);
export const fetchUserOrderBySerial = createAsyncThunk(
  'orders/userBySerial',
  (serial: string) => orderService.getUserOrderBySerial(serial)
);
export const cancelUserOrder = createAsyncThunk(
  'orders/userCancel',
  async (orderId: number) => {
    await orderService.cancelUserOrder(orderId);
    return orderId;
  }
);

// Admin thunks
export const fetchAdminOrders = createAsyncThunk('orders/adminAll', () => orderService.getAllAdminOrders());
export const fetchAdminOrdersByStatus = createAsyncThunk(
  'orders/adminByStatus',
  (status: OrderStatus) => orderService.getAdminOrdersByStatus(status)
);
export const fetchAdminOrderById = createAsyncThunk(
  'orders/adminById',
  (id: number) => orderService.getAdminOrderById(id)
);
export const updateAdminOrderStatus = createAsyncThunk(
  'orders/adminUpdateStatus',
  async (params: { orderId: number; newStatus: OrderStatus }) => {
    const data = await orderService.updateAdminOrderStatus(params.orderId, params.newStatus);
    return data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilterStatus(state, action: PayloadAction<OrdersState['filterStatus']>) {
      state.filterStatus = action.payload || 'ALL';
    }
  },
  extraReducers: builder => {
    builder
      // User list
      .addCase(fetchUserOrders.pending, s => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (s, a: PayloadAction<Order[]>) => {
        s.loading = false; s.list = a.payload;
      })
      .addCase(fetchUserOrders.rejected, (s, a) => {
        s.loading = false; s.error = a.error.message || 'Lỗi tải đơn';
      })
      .addCase(fetchUserOrdersByStatus.pending, s => { s.loading = true; })
      .addCase(fetchUserOrdersByStatus.fulfilled, (s, a: PayloadAction<Order[]>) => {
        s.loading = false; s.list = a.payload;
      })
      .addCase(fetchUserOrderBySerial.fulfilled, (s, a: PayloadAction<Order>) => {
        s.current = a.payload;
      })
      .addCase(cancelUserOrder.fulfilled, (s, a: PayloadAction<number>) => {
        s.list = s.list.map(o => o.id === a.payload ? { ...o, status: 'CANCELED' } : o);
        if (s.current && s.current.id === a.payload) s.current.status = 'CANCELED';
      })
      // Admin
      .addCase(fetchAdminOrders.pending, s => { s.adminLoading = true; })
      .addCase(fetchAdminOrders.fulfilled, (s, a: PayloadAction<Order[]>) => {
        s.adminLoading = false; s.adminList = a.payload;
      })
      .addCase(fetchAdminOrdersByStatus.fulfilled, (s, a: PayloadAction<Order[]>) => {
        s.adminList = a.payload;
      })
      .addCase(fetchAdminOrderById.fulfilled, (s, a: PayloadAction<Order>) => {
        s.current = a.payload;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (s, a: PayloadAction<Order>) => {
        s.adminList = s.adminList.map(o => o.id === a.payload.id ? a.payload : o);
        if (s.current && s.current.id === a.payload.id) s.current = a.payload;
      });
  }
});

export const { setFilterStatus } = orderSlice.actions;
export default orderSlice.reducer;