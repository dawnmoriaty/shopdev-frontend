import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import persistConfig from './persistConfig';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import addressReducer from './addressSlice';
import orderReducer from './orderSlice';

// Combine các reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  addresses: addressReducer,
  orders: orderReducer
});

// Áp dụng persistReducer vào rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;