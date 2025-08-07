import ProtectedRoute from "@/pages/auth/ProtectedRouter";
import UserDashboard from "@/pages/user/UserDashboard";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";


// Lazy loading các component
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const UnauthorizedPage = lazy(() => import("../pages/auth/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("../components/common/NotFoundPage"));

// Layouts
const PublicLayout = lazy(() => import("../layouts/PublicLayout"));
const UserLayout = lazy(() => import("../layouts/UserLayout"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));

// Admin pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminProductsPage = lazy(
  () => import("../pages/admin/products/ProductsPage")
);
const CategoryPage = lazy(
  () => import("../pages/admin/categories/CategoryPage")
);

// Public pages
const ProductListPage = lazy(() => import("../pages/public/ProductList"));
const ProductDetailPage = lazy(() => import("../pages/public/ProductDetail"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));

const router = createBrowserRouter([
  // Public Routes - Không cần đăng nhập
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductListPage />
          </Suspense>
        ),
      },
      {
        path: "products/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "unauthorized",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UnauthorizedPage />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CartPage />
          </Suspense>
        ),
      },
    ],
  },

  // Admin Routes - Yêu cầu quyền ROLE_ADMIN
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="ROLE_ADMIN" />,
    children: [
      {
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "products",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminProductsPage />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <CategoryPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // User Routes - Yêu cầu quyền ROLE_USER
  {
    path: "/user",
    element: <ProtectedRoute requiredRole="ROLE_USER" />,
    children: [
      {
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UserLayout />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <UserDashboard />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
