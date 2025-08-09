import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUserOrders,
  fetchUserOrdersByStatus,
  setFilterStatus,
} from "@/store/orderSlice";
import type { OrderStatus } from "@/types/order";
import { Link } from "react-router-dom";

const statuses: (OrderStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELED",
];

const UserOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { list, loading, filterStatus } = useAppSelector((s) => s.orders);

  useEffect(() => {
    if (!filterStatus || filterStatus === "ALL") dispatch(fetchUserOrders());
    else dispatch(fetchUserOrdersByStatus(filterStatus));
  }, [dispatch, filterStatus]);

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-xl">Đơn hàng của tôi</h1>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => dispatch(setFilterStatus(s))}
            className={`px-3 py-1 rounded text-sm border ${
              filterStatus === s
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <div>Đang tải...</div>}

      <div className="space-y-3">
        {!loading && list.length === 0 && (
          <div className="text-sm text-gray-500">Không có đơn hàng.</div>
        )}
        {list.map((o) => (
          <Link
            to={`/user/orders/${o.serialNumber}`}
            key={o.id}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <div className="font-medium">#{o.serialNumber}</div>
              <div className="text-sm">{o.status}</div>
            </div>
            <div className="text-sm mt-1">
              {o.shippingName} - {o.shippingPhone}
            </div>
            <div className="text-sm text-gray-600">Tổng: {o.totalAmount}</div>
            <div className="text-xs text-gray-500">
              {new Date(o.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPage;
