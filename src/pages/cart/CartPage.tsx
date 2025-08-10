import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, getCart, emptyCart } = useCart();

  console.log("🛒 CartPage state:", {
    items,
    itemsLength: items?.length,
    loading,
    error,
  });

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      emptyCart();
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        <div className="text-center py-12">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            items={items}
            onCheckout={handleCheckout}
            isLoading={loading}
            showCheckoutButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
