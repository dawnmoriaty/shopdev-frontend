import { useEffect, useState } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
  Home,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatOrderId = (id: string | undefined) => {
    if (!id) return "DH" + Date.now().toString().slice(-6);
    return id.startsWith("DH") ? id : `DH${id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đặt hàng thành công!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                <Badge variant="secondary" className="font-mono">
                  {formatOrderId(orderId)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian đặt:</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleString("vi-VN")}
                </span>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-left">
                Tiếp theo sẽ diễn ra:
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Xác nhận đơn hàng</div>
                    <div className="text-gray-600">Trong vòng 30 phút</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Chuẩn bị hàng</div>
                    <div className="text-gray-600">1-2 giờ</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Giao hàng</div>
                    <div className="text-gray-600">2-3 ngày làm việc</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium text-sm">
                  Phương thức thanh toán
                </span>
              </div>
              <p className="text-blue-600 text-sm">
                Thanh toán khi nhận hàng (COD)
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => navigate("/user/orders")}
                className="w-full"
              >
                Xem chi tiết đơn hàng
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ ({countdown}s)
              </Button>
            </div>

            {/* Contact Info */}
            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>
                Có thắc mắc? Liên hệ hotline:{" "}
                <a
                  href="tel:1900123456"
                  className="text-blue-600 hover:underline"
                >
                  1900 123 456
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
