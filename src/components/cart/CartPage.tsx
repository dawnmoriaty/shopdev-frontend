import { useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


const CartPage: React.FC = () => {
  const {
    items,
    loading,
    error,
    getCart,
    emptyCart,
    updateItem,
    removeItem,
    checkoutCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false); // Dùng ref để giữ trạng thái giữa các renders

  useEffect(() => {
    // Chỉ fetch khi đã đăng nhập và chưa fetch
    if (isAuthenticated() && !hasFetchedRef.current) {
      getCart();
      hasFetchedRef.current = true; // Đánh dấu đã fetch
    } else if (!isAuthenticated()) {
      navigate("/login");
    }

    // Cleanup function - quan trọng để tránh memory leaks
    return () => {
      // Không cần reset hasFetchedRef.current vì chúng ta muốn nó giữ giá trị
      // khi component bị re-render
    };
  }, [isAuthenticated, navigate, getCart]); // Thêm đầy đủ dependencies

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateItem(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      removeItem(id);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?")) {
      emptyCart();
    }
  };

  const handleCheckout = async () => {
    try {
      await checkoutCart();
      alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  };

  if (!isAuthenticated()) {
    return null; // Sẽ chuyển hướng trong useEffect
  }

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Danh sách sản phẩm trong giỏ hàng */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 border-b last:border-b-0"
              >
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="ml-4 flex-grow">
                  <h3 className="font-medium text-gray-900">
                    {item.productName}
                  </h3>
                  <p className="text-gray-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.productPrice)}
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="bg-gray-200 px-3 py-1 rounded-l"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-10 text-center border-t border-b border-gray-300 py-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="bg-gray-200 px-3 py-1 rounded-r"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng hóa đơn */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>

            <div className="border-t border-b py-2 mb-4">
              <div className="flex justify-between py-2">
                <span>Tạm tính</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(calculateTotal())}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Tổng cộng</span>
              <span className="text-indigo-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(calculateTotal())}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </button>

            <div className="mt-4">
              <Link
                to="/"
                className="block text-center text-indigo-600 hover:text-indigo-800"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
