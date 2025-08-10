import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { orderService } from "@/services/orderService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Order } from "@/types/order";

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders();
      setOrders(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải đơn hàng";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        color: "bg-blue-100 text-blue-800",
        icon: Package,
      },
      PROCESSING: {
        label: "Đang xử lý",
        color: "bg-purple-100 text-purple-800",
        icon: Package,
      },
      SHIPPING: {
        label: "Đang giao",
        color: "bg-orange-100 text-orange-800",
        icon: Truck,
      },
      DELIVERED: {
        label: "Đã giao",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      CANCELLED: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: Clock,
      },
      COMPLETED: {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      CANCELED: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: Clock,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchOrders} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          Làm mới
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm và đặt hàng ngay!
            </p>
            <Button onClick={() => navigate("/")}>Mua sắm ngay</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Đơn hàng #{order.serialNumber || order.id}
                  </CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Đặt hàng: {formatDate(order.createdAt)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        Người nhận: {order.shippingName}
                      </div>
                      <div className="text-sm text-gray-600">
                        SĐT: {order.shippingPhone}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(order.totalAmount)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/user/orders/${order.serialNumber || order.id}`
                          )
                        }
                        className="mt-2"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
