import { useState, useEffect } from "react";
import type { Address, AddressRequest } from "@/types/address";

interface Props {
  initial?: Address | null;
  loading?: boolean;
  onSubmit: (data: AddressRequest) => Promise<void> | void;
  onCancel?: () => void;
}

export const AddressForm: React.FC<Props> = ({
  initial,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<AddressRequest>({
    receiveName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        receiveName: initial.receiveName,
        phone: initial.phone,
        address: initial.address,
      });
    }
  }, [initial]);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        name="receiveName"
        value={form.receiveName}
        onChange={change}
        placeholder="Tên người nhận"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        name="phone"
        value={form.phone}
        onChange={change}
        placeholder="Số điện thoại"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <textarea
        name="address"
        value={form.address}
        onChange={change}
        placeholder="Địa chỉ chi tiết"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {initial ? "Cập nhật" : "Thêm"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded"
            disabled={loading}
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};
