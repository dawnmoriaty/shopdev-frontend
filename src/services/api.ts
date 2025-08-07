import axios from 'axios';

// Cache cho các request GET
const requestCache = new Map<string, {data: unknown, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

// Tạo instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Thêm token authorization nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Kiểm tra cache cho các GET requests
    if (config.method?.toLowerCase() === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = requestCache.get(cacheKey);
      
      if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_DURATION)) {
        // Đánh dấu request là từ cache
        config.adapter = () => {
          return Promise.resolve({
            data: cachedResponse.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          });
        };
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache response cho GET requests
    if (response.config.method?.toLowerCase() === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;