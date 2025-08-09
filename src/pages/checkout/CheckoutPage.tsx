import { AddressList } from "@/components/address/AddressList";
import { cartService } from "@/services/cartService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [addressId, setAddressId] = useState<number | null>(null);
  const [payMethod] = useState<"COD">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // (Optional) scroll top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submitOrder = async () => {
    if (!addressId) {
      alert("Vui lòng chọn địa chỉ");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      console.log("Checkout payload:", { addressId, paymentMethod: payMethod });
      await cartService.checkout({ addressId, paymentMethod: payMethod });
      navigate("/user/orders");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.response?.data?.message || "Lỗi đặt hàng");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <AddressList
          selectable
          selectedId={addressId}
          onSelect={(id) => setAddressId(id)}
          autoSelectFirst
        />
      </div>
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Thanh toán</h2>
        <div className="text-sm">
          Phương thức: COD (Thanh toán khi nhận hàng)
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}
        <button
          onClick={submitOrder}
          disabled={!addressId || submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        >
          {submitting ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}
