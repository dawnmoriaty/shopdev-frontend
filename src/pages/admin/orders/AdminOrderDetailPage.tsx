import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminOrderById,
  updateAdminOrderStatus,
} from "@/store/orderSlice";
import type { OrderStatus } from "@/types/order";

const allowed: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELED",
];

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current } = useAppSelector((s) => s.orders);
  const [updating, setUpdating] = useState(false);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("CONFIRMED");

  useEffect(() => {
    if (id) dispatch(fetchAdminOrderById(Number(id)));
  }, [id, dispatch]);

  useEffect(() => {
    if (current) setNextStatus(current.status);
  }, [current]);

  const update = useCallback(async () => {
    if (!current) return;
    setUpdating(true);
    try {
      await dispatch(
        updateAdminOrderStatus({ orderId: current.id, newStatus: nextStatus })
      ).unwrap();
    } finally {
      setUpdating(false);
    }
  }, [dispatch, current, nextStatus]);

  if (!current) return <div>Đang tải...</div>;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm underline">
        Quay lại
      </button>
      <h1 className="font-semibold text-xl">Đơn #{current.serialNumber}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div>
            <span className="font-medium">User:</span> {current.userId}
          </div>
          <div>
            <span className="font-medium">Trạng thái:</span> {current.status}
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
              className="border px-2 py-1 rounded text-sm"
            >
              {allowed.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={update}
              disabled={updating || nextStatus === current.status}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Cập nhật
            </button>
          </div>
          <div>
            <span className="font-medium">Thanh toán:</span>{" "}
            {current.paymentMethod}
          </div>
          <div>
            <span className="font-medium">Tổng:</span> {current.totalAmount}
          </div>
          <div>
            <span className="font-medium">Giao tới:</span>{" "}
            {current.shippingName}
          </div>
          <div>{current.shippingPhone}</div>
          <div>{current.shippingAddress}</div>
          {current.note && (
            <div>
              <span className="font-medium">Note:</span> {current.note}
            </div>
          )}
          <div className="text-xs text-gray-500">
            Tạo: {new Date(current.createdAt).toLocaleString()}
          </div>
        </div>
        <div>
          <h2 className="font-medium mb-2">Items</h2>
          <ul className="divide-y">
            {current.items.map((i) => (
              <li key={i.id} className="py-2 text-sm flex justify-between">
                <div>
                  <div className="font-medium">{i.productName}</div>
                  <div className="text-xs text-gray-500">x {i.quantity}</div>
                </div>
                <div className="text-right">
                  <div>{i.unitPrice}</div>
                  <div className="text-xs text-gray-500">{i.lineTotal}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
