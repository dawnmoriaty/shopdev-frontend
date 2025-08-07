import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

const CartSummary: React.FC = () => {
  const { getTotalPrice, checkoutCart, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await checkoutCart();
      alert('Thanh toán thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>
      
      <div className="border-t border-b py-2 mb-4">
        <div className="flex justify-between py-2">
          <span>Tạm tính</span>
          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getTotalPrice())}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Phí vận chuyển</span>
          <span>Miễn phí</span>
        </div>
      </div>
      
      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Tổng cộng</span>
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getTotalPrice())}</span>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={loading || getTotalPrice() === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </button>
    </div>
  );
};

export default CartSummary;