/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  createSelector,
  isPending,
  isRejected
} from '@reduxjs/toolkit';
import { cartService } from '../services/cartService';
import type { Order } from '@/types/order';
import type { CartItem, CartItemRequest, QuantityRequest } from '@/types/cart';
import type { RootState } from '../store'; 

// Định nghĩa một kiểu cho lỗi từ API để tăng type safety
interface ApiError {
  message: string;
}

// Helper function để lấy message lỗi một cách an toàn
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as any).response;
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data as ApiError;
      if (data && typeof data.message === 'string') {
        return data.message;
      }
    }
  }
  return 'Đã xảy ra lỗi không xác định';
};


interface CartState {
  items: CartItem[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Sử dụng trạng thái chi tiết hơn
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: 'idle',
  error: null
};

// Async thunks (Giữ nguyên logic nhưng cải thiện error handling)
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart();
  } catch (error: unknown) {
    // Xử lý trường hợp chưa đăng nhập - không báo lỗi mà trả về mảng rỗng
    if ((error as any).response?.status === 401) {
      return [];
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartItem: CartItemRequest, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(cartItem);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, request }: { cartItemId: number; request: QuantityRequest }, { rejectWithValue }) => {
    try {
      return await cartService.updateCartItem(cartItemId, request);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      await cartService.deleteCartItem(cartItemId);
      return cartItemId; // Trả về ID để xử lý trong reducer
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
    return null;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// checkout thunk không thay đổi
export const checkout = createAsyncThunk(
  'cart/checkout',
  async (payload: { addressId: number; paymentMethod: 'COD' | 'VNPAY' | 'MOMO'; note?: string }, { rejectWithValue }) => {
    try {
      const order: Order = await cartService.checkout(payload);
      return order;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCartOnLogout: (state) => {
      state.items = [];
      state.error = null;
      state.loading = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý các trường hợp `fulfilled` riêng lẻ
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = 'succeeded';
        const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id);
        if (existingItemIndex >= 0) {
          state.items[existingItemIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.items = [];
      })
      .addCase(checkout.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.items = []; // Clear cart sau khi checkout thành công
      })

      // Dùng addMatcher để xử lý các trường hợp chung
      .addMatcher(isPending(fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart, checkout), (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addMatcher(isRejected(fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart, checkout), (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions và reducer
export const { clearError, clearCartOnLogout } = cartSlice.actions;
export default cartSlice.reducer;

// --- SELECTORS ---
// Co-located selectors để truy vấn state một cách nhất quán
const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector([selectCartState], (cart) => cart.items);

export const selectCartLoading = createSelector([selectCartState], (cart) => cart.loading);

export const selectCartError = createSelector([selectCartState], (cart) => cart.error);

export const selectTotalCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalCartPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.productPrice * item.quantity, 0)
);