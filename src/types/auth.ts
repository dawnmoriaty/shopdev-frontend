
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string; 
}

export interface AuthResponse {
  user_id: number;
  username: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  role: string[];
}

// Kiểu dữ liệu refresh token
export interface TokenRefreshRequest {
  refreshToken: string;
}