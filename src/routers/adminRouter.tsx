import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

// Lazy loading các component
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const CategoryPage = lazy(
  () => import("../pages/admin/categories/CategoryPage")
);
const ProductsPage = lazy(() => import("@/pages/admin/products/ProductsPage"));

const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      path: "",
      element: <Dashboard />,
    },
    {
      path: "categories",
      element: <CategoryPage />,
    },
    {
      path: "products",
      element: <ProductsPage />,
    },
    // Thêm các route khác ở đây
  ],
};

export default adminRoutes;
