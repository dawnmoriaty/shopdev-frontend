import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
}) => {
  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      setLoading(true);
      await addItemToCart(id, 1);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/products/${id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={imageUrl || "/placeholder.png"}
            alt={name}
            className="w-full h-48 object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price)}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
