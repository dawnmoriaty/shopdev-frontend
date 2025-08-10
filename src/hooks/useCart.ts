import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useRef, useMemo } from 'react';
import type { AppDispatch } from '@/store';
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  deleteCartItem, 
  clearCart, 
  checkout,
  selectCartItems,
  selectCartLoading,
  selectCartError,
} from '@/store/cartSlice';
import { useAuth } from './useAuth';
import type { CartItemRequest, QuantityRequest } from '@/types/cart';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rawItems = useSelector(selectCartItems);
  const items = useMemo(() => rawItems || [], [rawItems]);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const { isAdmin } = useAuth();
  
  // Sử dụng ref để theo dõi trạng thái fetch
  const fetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  // Thời gian tối thiểu giữa các lần fetch (5 giây)
  const MIN_FETCH_INTERVAL = 5000;

  // Lấy giỏ hàng - chỉ fetch nếu cần thiết
  const getCart = useCallback(() => {
    if (isAdmin()) { // Admin không dùng giỏ hàng user
      return Promise.resolve([]);
    }
    const now = Date.now();
    if (fetchingRef.current || (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL)) {
      return Promise.resolve(items);
    }
    fetchingRef.current = true;
    return dispatch(fetchCart())
      .then(result => {
        lastFetchTimeRef.current = Date.now();
        return result.payload;
      })
      .catch(() => [])
      .finally(() => {
        fetchingRef.current = false;
      });
  }, [dispatch, items, isAdmin]);

  // Thêm sản phẩm vào giỏ hàng - thêm debounce
  const addItemToCart = useCallback((productId: number, quantity: number = 1) => {
    const cartItem: CartItemRequest = {
      productId,
      quantity
    };
    if (isAdmin()) return Promise.resolve();
    return dispatch(addToCart(cartItem));
  }, [dispatch, isAdmin]);

  // Cập nhật số lượng sản phẩm - thêm debounce
  const updateItem = useCallback((cartItemId: number, quantity: number) => {
    const request: QuantityRequest = { quantity };
    if (isAdmin()) return Promise.resolve();
    return dispatch(updateCartItem({ cartItemId, request }));
  }, [dispatch, isAdmin]);

  return {
    items,
    loading: loading === 'pending',
    error,
    getTotalItems: useCallback(() => items.reduce((total, item) => total + item.quantity, 0), [items]),
    getTotalPrice: useCallback(() => items.reduce((total, item) => total + (item.productPrice * item.quantity), 0), [items]),
    getCart,
    addItemToCart,
    updateItem,
    removeItem: useCallback((cartItemId: number) => dispatch(deleteCartItem(cartItemId)), [dispatch]),
    emptyCart: useCallback(() => dispatch(clearCart()), [dispatch]),
    checkoutCart: useCallback((payload: { addressId: number; paymentMethod: 'COD' | 'VNPAY' | 'MOMO'; note?: string }) => {
      if (isAdmin()) return Promise.resolve();
      return dispatch(checkout(payload));
    }, [dispatch, isAdmin])
  };
};