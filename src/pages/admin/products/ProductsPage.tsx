import { useEffect, useState } from "react";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import ProductForm from "./ProductForm";
import type { Product, ProductRequest } from "@/types/product";
import type { Category } from "@/types/category";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products
        const productsData = await productService.getAllProducts();
        setProducts(productsData);

        // Fetch categories for dropdown in form
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshing]);

  // Xử lý thêm mới sản phẩm
  const handleCreateProduct = async (productData: ProductRequest) => {
    try {
      setLoading(true);
      await productService.createProduct(productData);
      setShowForm(false);
      // Refresh lại danh sách
      setRefreshing((prev) => prev + 1);
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = async (productData: ProductRequest) => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      await productService.updateProduct(selectedProduct.id, productData);
      setShowForm(false);
      setSelectedProduct(null);
      // Refresh lại danh sách
      setRefreshing((prev) => prev + 1);
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (productToDelete === null) return;

    try {
      setLoading(true);
      await productService.deleteProduct(productToDelete);
      setShowDeleteModal(false);
      setProductToDelete(null);
      // Refresh lại danh sách
      setRefreshing((prev) => prev + 1);
      alert("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Mở form để sửa sản phẩm
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  // Xử lý form submit
  const handleFormSubmit = (productData: ProductRequest) => {
    if (selectedProduct) {
      handleUpdateProduct(productData);
    } else {
      handleCreateProduct(productData);
    }
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Thêm sản phẩm mới
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Ảnh</th>
                <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                <th className="py-3 px-4 text-left">Danh mục</th>
                <th className="py-3 px-4 text-left">Giá</th>
                <th className="py-3 px-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{product.id}</td>
                    <td className="py-3 px-4">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.categoryName}</td>
                    <td className="py-3 px-4">
                      {formatCurrency(product.unitPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product.id);
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <ProductForm
              product={selectedProduct || undefined}
              categories={categories}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm này không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
