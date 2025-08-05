import storage from 'redux-persist/lib/storage';

// Cấu hình lưu auth state vào localStorage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Chỉ lưu state auth
};

export default persistConfig;