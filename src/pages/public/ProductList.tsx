/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";
import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/category";
import { useDebounce } from "@/hooks/useDebounce";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Fetch tất cả sản phẩm và danh mục khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch danh mục
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);

        // Fetch sản phẩm
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
        console.log("Fetched products:", productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch sản phẩm theo danh mục khi selectedCategory thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: Product[] = [];
        if (selectedCategory && selectedCategory !== 0) {
          data = await productService.getProductsByCategoryId(selectedCategory);
        } else {
          data = await productService.getAllProducts();
        }

        // Filter client-side (tạm)
        const filtered = debouncedSearch.trim()
          ? data.filter((p) =>
              p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
          : data;

        setProducts(filtered);
      } catch (err) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearch]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>

      {/* Bộ lọc danh mục */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Danh mục</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(0)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 0 || selectedCategory === null
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Tất cả
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tìm kiếm sản phẩm */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.unitPrice}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
