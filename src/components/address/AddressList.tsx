/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/store/addressSlice";
import type { Address, AddressRequest } from "@/types/address";
import { AddressForm } from "./AddressForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
  selectable?: boolean;
  onSelect?: (id: number) => void;
  selectedId?: number | null;
  autoSelectFirst?: boolean;
}

export const AddressList: React.FC<Props> = ({
  selectable,
  onSelect,
  selectedId,
  autoSelectFirst = true,
}) => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.addresses);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Auto select first address if needed
  useEffect(() => {
    if (
      selectable &&
      autoSelectFirst &&
      !selectedId &&
      items.length > 0 &&
      onSelect
    ) {
      onSelect(items[0].id);
    }
  }, [items, selectable, autoSelectFirst, selectedId, onSelect]);

  const submitCreate = useCallback(
    async (data: AddressRequest) => {
      setSubmitting(true);
      try {
        const created = await dispatch(createAddress(data)).unwrap();
        setAdding(false);
        // chọn luôn địa chỉ vừa tạo
        if (selectable && onSelect) onSelect(created.id);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, selectable, onSelect]
  );

  const submitUpdate = useCallback(
    async (data: AddressRequest) => {
      if (!editing) return;
      setSubmitting(true);
      try {
        await dispatch(updateAddress({ id: editing.id, data })).unwrap();
        setEditing(null);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, editing]
  );

  const handleDelete = (id: number) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    dispatch(deleteAddress(id));
  };

  const list = items || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Địa chỉ của tôi</h2>
        {!adding && !editing && (
          <button
            className="text-sm bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => setAdding(true)}
          >
            Thêm địa chỉ
          </button>
        )}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {adding && (
        <div className="border p-4 rounded bg-gray-50">
          <AddressForm
            onSubmit={submitCreate}
            onCancel={() => !submitting && setAdding(false)}
            loading={submitting}
          />
        </div>
      )}

      {editing && (
        <div className="border p-4 rounded bg-gray-50">
          <AddressForm
            initial={editing}
            onSubmit={submitUpdate}
            onCancel={() => !submitting && setEditing(null)}
            loading={submitting}
          />
        </div>
      )}

      {loading && <div>Đang tải...</div>}

      <ul className="space-y-3">
        {!loading && list.length === 0 && (
          <li className="text-sm text-gray-500">Chưa có địa chỉ.</li>
        )}
        {list.map((a) => {
          const sel = selectedId === a.id;
          return (
            <li
              key={a.id}
              className={`border rounded p-3 flex flex-col gap-2 ${
                sel ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="font-medium">{a.receiveName}</div>
                <div className="text-sm">{a.phone}</div>
              </div>
              <div className="text-sm">{a.address}</div>
              <div className="flex gap-2">
                {selectable && (
                  <button
                    className="text-xs border px-2 py-1 rounded"
                    onClick={() => onSelect && onSelect(a.id)}
                  >
                    {sel ? "Đang chọn" : "Chọn"}
                  </button>
                )}
                <button
                  className="text-xs border px-2 py-1 rounded"
                  onClick={() => setEditing(a)}
                >
                  Sửa
                </button>
                <button
                  className="text-xs border px-2 py-1 rounded text-red-600"
                  onClick={() => handleDelete(a.id)}
                >
                  Xóa
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
