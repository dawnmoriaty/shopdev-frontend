import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "@/services/productService";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/types/product";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const productData = await productService.getProductById(parseInt(id));
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated()) {
      const confirmed = window.confirm(
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay?"
      );

      if (confirmed) {
        // Lưu url hiện tại vào sessionStorage để redirect sau khi đăng nhập
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        navigate("/login");
      }
      return;
    }

    try {
      setAddingToCart(true);
      await addItemToCart(product.id, quantity);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không tìm thấy sản phẩm</p>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          ← Quay lại trang chủ
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="md:w-1/2 p-8">
            <div className="uppercase text-indigo-600 text-xs font-bold tracking-widest mb-1">
              {product.categoryName}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>

            <div className="text-2xl font-bold text-gray-900 mb-6">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.unitPrice)}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Không có mô tả"}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Số lượng</h3>
              <div className="flex items-center">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="bg-gray-200 px-3 py-1 rounded-l"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-200 px-3 py-1 rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-bold transition duration-300 disabled:opacity-50"
            >
              {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
