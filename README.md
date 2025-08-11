# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# ShopDev Frontend - Giao diện người dùng E-commerce

Đây là mã nguồn frontend cho dự án thương mại điện tử ShopDev, được xây dựng bằng React và TypeScript, cung cấp một giao diện người dùng hiện đại, nhanh và dễ sử dụng.

## ✨ Tính năng chính

-   **Giao diện cho Người dùng (Public/User):**
    -   Trang chủ hiển thị danh sách sản phẩm.
    -   Lọc và tìm kiếm sản phẩm theo tên và danh mục.
    -   Xem chi tiết thông tin sản phẩm.
    -   Đăng ký, đăng nhập tài khoản.
    -   Quản lý giỏ hàng (thêm, sửa, xóa sản phẩm).
    -   Quy trình thanh toán (Checkout) và đặt hàng.
    -   Xem lịch sử và chi tiết các đơn hàng đã đặt.
    -   Quản lý địa chỉ giao hàng.
-   **Giao diện cho Quản trị viên (Admin):**
    -   Trang tổng quan (Dashboard).
    -   Quản lý sản phẩm (CRUD).
    -   Quản lý danh mục (CRUD).
    -   Quản lý tất cả đơn hàng của người dùng.

## 🚀 Công nghệ sử dụng

-   **Framework**: React 19, TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Quản lý trạng thái**: Redux Toolkit, Redux Persist
-   **Routing**: React Router DOM v7
-   **Client API**: Axios
-   **Thông báo (Toast)**: Sonner

## 🔧 Cài đặt và Chạy dự án

1.  **Clone repository:**
    ```bash
    git clone <URL_CUA_REPOSITORY>
    cd shopdev-frontend
    ```

2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    ```
    *Lưu ý: Đảm bảo bạn có Node.js phiên bản 18 trở lên.*

3.  **Cấu hình môi trường:**
    -   Tạo một file `.env` ở thư mục gốc của frontend.
    -   Thêm URL của backend API vào file:
        ```env
        VITE_API_URL=http://localhost:8080/api/v1
        ```
        *(Điều chỉnh port nếu backend của bạn chạy ở port khác)*

4.  **Chạy ứng dụng ở chế độ phát triển:**
    ```bash
    npm run dev
    ```

5.  **Mở trình duyệt** và truy cập vào `http://localhost:5173` (hoặc port mà Vite cung cấp).

## 📦 Build cho Production

Để tạo phiên bản tối ưu cho môi trường production, chạy lệnh sau:

```bash
npm run build
