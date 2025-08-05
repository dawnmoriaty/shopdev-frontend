import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { login, register, logout } from '@/store/authSlice';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  // Kiểm tra có phải admin
  const isAdmin = (): boolean => {
    return user?.role?.includes('ROLE_ADMIN') || false;
  };

  // Kiểm tra có phải user
  const isUser = (): boolean => {
    return user?.role?.includes('ROLE_USER') || false;
  };

  // Kiểm tra đã đăng nhập
  const isAuthenticated = (): boolean => {
    return !!user;
  };

  // Kiểm tra có quyền cụ thể
  const hasRole = (role: string): boolean => {
    return user?.role?.includes(role) || false;
  };

  // Đăng nhập
  const loginUser = (credentials: LoginRequest) => {
    return dispatch(login(credentials));
  };

  // Đăng ký - Sửa lại để chỉ nhận 3 tham số
  const registerUser = (username: string, email: string, password: string) => {
    const userData: RegisterRequest = { 
      username, 
      email, 
      password,
      // Mặc định là ROLE_USER
      role: "ROLE_USER"
    };
    return dispatch(register(userData));
  };

  // Đăng xuất
  const logoutUser = () => {
    if (user?.refresh_token) {
      return dispatch(logout(user.refresh_token));
    }
    return Promise.resolve();
  };

  return {
    user,
    loading,
    error,
    isAdmin,
    isUser,
    isAuthenticated,
    hasRole,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  };
};