import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminOrders, fetchAdminOrdersByStatus } from "@/store/orderSlice";
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

const AdminOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { adminList, adminLoading } = useAppSelector((s) => s.orders);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  useEffect(() => {
    if (filter === "ALL") dispatch(fetchAdminOrders());
    else dispatch(fetchAdminOrdersByStatus(filter));
  }, [dispatch, filter]);

  // ...after adminList fetched, optionally sort...
  const list = [...adminList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-xl">Quản lý đơn hàng</h1>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded text-sm border ${
              filter === s
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {adminLoading && <div>Đang tải...</div>}

      <div className="overflow-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Serial</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{o.id}</td>
                <td className="p-2 border">{o.serialNumber}</td>
                <td className="p-2 border">{o.userId}</td>
                <td className="p-2 border">{o.status}</td>
                <td className="p-2 border">{o.totalAmount}</td>
                <td className="p-2 border text-xs">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="text-indigo-600 underline"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
            {adminList.length === 0 && !adminLoading && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Không có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
