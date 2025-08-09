import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserOrderBySerial, cancelUserOrder } from "@/store/orderSlice";

const UserOrderDetailPage = () => {
  const { serial } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current } = useAppSelector((s) => s.orders);

  useEffect(() => {
    if (serial) dispatch(fetchUserOrderBySerial(serial));
  }, [serial, dispatch]);

  const cancel = useCallback(() => {
    if (!current) return;
    if (!confirm("Hủy đơn này?")) return;
    dispatch(cancelUserOrder(current.id));
  }, [current, dispatch]);

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
            <span className="font-medium">Trạng thái:</span> {current.status}
          </div>
          <div>
            <span className="font-medium">Thanh toán:</span>{" "}
            {current.paymentMethod}
          </div>
          <div>
            <span className="font-medium">Tổng tiền:</span>{" "}
            {current.totalAmount}
          </div>
          <div>
            <span className="font-medium">Giao tới:</span>{" "}
            {current.shippingName}
          </div>
          <div>{current.shippingPhone}</div>
          <div>{current.shippingAddress}</div>
          {current.note && (
            <div>
              <span className="font-medium">Ghi chú:</span> {current.note}
            </div>
          )}
          <div className="text-xs text-gray-500">
            Tạo: {new Date(current.createdAt).toLocaleString()}
          </div>
          {current.status === "PENDING" && (
            <button
              onClick={cancel}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Hủy đơn
            </button>
          )}
        </div>
        <div>
          <h2 className="font-medium mb-2">Sản phẩm</h2>
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

export default UserOrderDetailPage;
