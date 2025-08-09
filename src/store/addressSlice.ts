import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { addressService } from '@/services/addressService';
import type { Address, AddressRequest } from '@/types/address';

export interface AddressState {
  items: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  items: [],
  loading: false,
  error: null
};

export const fetchAddresses = createAsyncThunk('addresses/fetchAll', async () => {
  return await addressService.getAll();
});

export const createAddress = createAsyncThunk('addresses/create', async (payload: AddressRequest) => {
  return await addressService.create(payload);
});

export const updateAddress = createAsyncThunk(
  'addresses/update',
  async ({ id, data }: { id: number; data: AddressRequest }) => {
    return await addressService.update(id, data);
  }
);

export const deleteAddress = createAsyncThunk('addresses/delete', async (id: number) => {
  await addressService.remove(id);
  return id;
});

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAddresses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi tải địa chỉ';
      })
      .addCase(createAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        const idx = state.items.findIndex(a => a.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(a => a.id !== action.payload);
      });
  }
});

export default addressSlice.reducer;