import PublicLayout from "@/layouts/PublicLayout";

export const publicRoutes = {
  path: "/",
  element: <PublicLayout />,
  children: [
    // { path: "", element: <HomePage /> },
    // { path: "products", element: <ProductPage /> },
  ],
}
