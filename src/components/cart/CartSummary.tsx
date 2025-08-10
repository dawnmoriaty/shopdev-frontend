import { useMemo } from "react";
import { ShoppingBag, Gift, Truck, CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/types/cart";

interface CartSummaryProps {
  items?: CartItem[] | null;
  onCheckout?: () => void;
  isLoading?: boolean;
  showCheckoutButton?: boolean;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items = [],
  onCheckout,
  isLoading = false,
  showCheckoutButton = true,
  className = "",
}) => {
  console.log("🛒 CartSummary received props:", {
    items,
    itemsLength: items?.length,
    isArray: Array.isArray(items),
    onCheckout: !!onCheckout,
    showCheckoutButton,
  });

  const summary = useMemo(() => {
    // Ensure items is always an array - handle null, undefined, and non-arrays
    const safeItems = Array.isArray(items) ? items : [];

    console.log("CartSummary items:", items, "safeItems:", safeItems);

    const totalItems = safeItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = safeItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );

    // Calculate shipping fee (free shipping for orders over 500k VND)
    const freeShippingThreshold = 500000;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : 30000;

    // Calculate discount (example: 5% discount for orders over 1M VND)
    const discountThreshold = 1000000;
    const discountRate = subtotal >= discountThreshold ? 0.05 : 0;
    const discount = subtotal * discountRate;

    const total = subtotal + shippingFee - discount;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    return {
      totalItems,
      subtotal,
      shippingFee,
      discount,
      total,
      isEmpty: safeItems.length === 0,
      freeShippingThreshold,
      amountToFreeShipping,
      hasDiscount: discount > 0,
      hasFreeShipping: shippingFee === 0 && subtotal > 0,
    };
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (summary.isEmpty) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Giỏ hàng trống
          </h3>
          <p className="text-gray-600 mb-4">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </p>
          <Button
            onClick={() => (window.location.href = "/products")}
            className="w-full"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Tiếp tục mua sắm
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Tóm tắt đơn hàng
          <Badge variant="secondary" className="ml-auto">
            {summary.totalItems} sản phẩm
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Tạm tính ({summary.totalItems} sản phẩm)
            </span>
            <span className="font-medium">{formatPrice(summary.subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <Truck className="w-4 h-4" />
              Phí vận chuyển
            </span>
            <span
              className={`font-medium ${
                summary.hasFreeShipping ? "text-green-600" : ""
              }`}
            >
              {summary.hasFreeShipping ? (
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-100"
                >
                  Miễn phí
                </Badge>
              ) : (
                formatPrice(summary.shippingFee)
              )}
            </span>
          </div>

          {summary.hasDiscount && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <Gift className="w-4 h-4" />
                Giảm giá
              </span>
              <span className="font-medium text-green-600">
                -{formatPrice(summary.discount)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-red-600">{formatPrice(summary.total)}</span>
        </div>

        {/* Free Shipping Progress */}
        {!summary.hasFreeShipping && summary.amountToFreeShipping > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
              <Truck className="w-4 h-4" />
              <span className="font-medium">Miễn phí vận chuyển</span>
            </div>
            <p className="text-xs text-blue-600">
              Mua thêm{" "}
              <span className="font-semibold">
                {formatPrice(summary.amountToFreeShipping)}
              </span>{" "}
              để được miễn phí vận chuyển
            </p>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    (summary.subtotal / summary.freeShippingThreshold) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Truck className="w-4 h-4 text-green-600" />
            <span>Giao hàng nhanh 2-3 ngày</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Thanh toán an toàn 100%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Gift className="w-4 h-4 text-purple-600" />
            <span>Đổi trả miễn phí trong 7 ngày</span>
          </div>
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button
            onClick={onCheckout}
            disabled={isLoading || summary.isEmpty}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                Tiến hành thanh toán
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}

        {/* Continue Shopping */}
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/products")}
          className="w-full"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Tiếp tục mua sắm
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
