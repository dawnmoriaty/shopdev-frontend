import { useState, useEffect } from "react";
import {
  CreditCard,
  MapPin,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useSelector, useDispatch } from "react-redux";
import { selectAddresses, fetchAddresses } from "@/store/addressSlice";
import type { AppDispatch } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddressList } from "@/components/address/AddressList";
import CartItem from "@/components/cart/CartItem";
import { toast } from "sonner";
import type { CreateOrderRequest } from "@/types/cart";
import type { Address } from "@/types/address";

const PAYMENT_METHODS = [
  {
    id: "COD" as const,
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận được sản phẩm",
    icon: <CreditCard className="w-5 h-5" />,
    fee: 0,
    recommended: true,
  },
  {
    id: "VNPAY" as const,
    name: "VNPay",
    description: "Thanh toán trực tuyến qua VNPay",
    icon: <CreditCard className="w-5 h-5" />,
    fee: 0,
    comingSoon: true,
  },
  {
    id: "MOMO" as const,
    name: "MoMo",
    description: "Thanh toán qua ví điện tử MoMo",
    icon: <CreditCard className="w-5 h-5" />,
    fee: 0,
    comingSoon: true,
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, checkoutCart } = useCart();
  const addresses = useSelector(selectAddresses) as Address[];

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "COD" | "VNPAY" | "MOMO"
  >("COD");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Auto-select first address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error("Giỏ hàng trống");
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const calculateSummary = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
    const freeShippingThreshold = 500000;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : 30000;

    const selectedMethod = PAYMENT_METHODS.find(
      (method) => method.id === selectedPaymentMethod
    );
    const paymentFee = selectedMethod?.fee || 0;

    const total = subtotal + shippingFee + paymentFee;

    return {
      subtotal,
      shippingFee,
      paymentFee,
      total,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  };

  const summary = calculateSummary();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      setError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (!selectedPaymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const selectedMethod = PAYMENT_METHODS.find(
      (method) => method.id === selectedPaymentMethod
    );
    if (selectedMethod?.comingSoon) {
      setError("Phương thức thanh toán này chưa được hỗ trợ");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData: CreateOrderRequest = {
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
        note: note.trim() || undefined,
      };

      console.log("Submitting order:", orderData);
      const result = await checkoutCart(orderData);

      toast.success("Đặt hàng thành công!");

      // Navigate to order success page with order ID
      const payload = result?.payload as { id?: string; orderId?: string } | undefined;
      const orderId =
        payload?.id ||
        payload?.orderId ||
        Date.now().toString();
      navigate(`/order-success/${orderId}`);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Có lỗi xảy ra khi đặt hàng";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
              <p className="text-gray-600 mt-1">
                Xác nhận thông tin và hoàn tất đơn hàng
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle className="w-4 h-4" />
              Giỏ hàng
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Thanh toán
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              Hoàn thành
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddressList
                  selectable
                  selectedId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  autoSelectFirst
                />
                {addresses.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      Chưa có địa chỉ giao hàng
                    </p>
                    <Button onClick={() => navigate("/account/addresses")}>
                      Thêm địa chỉ mới
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      method.comingSoon ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      !method.comingSoon && setSelectedPaymentMethod(method.id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === method.id}
                        onChange={() =>
                          !method.comingSoon &&
                          setSelectedPaymentMethod(method.id)
                        }
                        disabled={method.comingSoon}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {method.icon}
                          <span className="font-medium">{method.name}</span>
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Khuyến nghị
                            </Badge>
                          )}
                          {method.comingSoon && (
                            <Badge variant="outline" className="text-xs">
                              Sắp có
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {method.description}
                        </p>
                        {method.fee > 0 && (
                          <p className="text-sm text-gray-900 mt-1">
                            Phí: {formatPrice(method.fee)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Note */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Ghi chú đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="note"
                  placeholder="Nhập ghi chú cho đơn hàng (ví dụ: giao hàng giờ hành chính, gọi trước khi giao...)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Đơn hàng ({summary.totalItems} sản phẩm)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} compact />
                  ))}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span
                      className={
                        summary.shippingFee === 0 ? "text-green-600" : ""
                      }
                    >
                      {summary.shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(summary.shippingFee)}
                    </span>
                  </div>
                  {summary.paymentFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Phí thanh toán</span>
                      <span>{formatPrice(summary.paymentFee)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-red-600">
                        {formatPrice(summary.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={
                  isSubmitting || !selectedAddressId || addresses.length === 0
                }
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>Đặt hàng · {formatPrice(summary.total)}</>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Bằng cách đặt hàng, bạn đồng ý với{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Chính sách bảo mật
                </a>{" "}
                của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
