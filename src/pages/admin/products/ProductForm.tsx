import React, { useEffect, useState } from "react";
import type { Product, ProductRequest } from "@/types/product";
import type { Category } from "@/types/category";
import { imageService } from "@/services/imageService";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (product: ProductRequest) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProductRequest>({
    name: "",
    description: "",
    unitPrice: 0,
    imageUrl: "",
    categoryId: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    unitPrice: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Nếu có product được truyền vào (chế độ edit), cập nhật formData
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        unitPrice: product.unitPrice,
        imageUrl: product.imageUrl || "",
        categoryId: product.categoryId,
      });
      setPreviewUrl(product.imageUrl || "");
    } else if (categories.length > 0) {
      // Set danh mục mặc định cho sản phẩm mới
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [product, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "unitPrice"
          ? parseFloat(value)
          : name === "categoryId"
          ? parseInt(value)
          : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);

      // Preview ảnh
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", unitPrice: "", categoryId: "" };

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name =
        "Tên sản phẩm không được để trống và phải có ít nhất 2 ký tự";
      valid = false;
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = "Giá sản phẩm phải lớn hơn 0";
      valid = false;
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục sản phẩm";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Upload ảnh nếu có ảnh mới được chọn
      if (imageFile) {
        setUploadingImage(true);
        const imageUrl = await imageService.uploadImage(imageFile);

        // Cập nhật formData với URL ảnh mới
        const updatedData = {
          ...formData,
          imageUrl,
        };

        // Gửi form với URL ảnh mới
        onSubmit(updatedData);
      } else {
        // Nếu không có ảnh mới, gửi form với dữ liệu hiện tại
        onSubmit(formData);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý form:", err);
      alert("Có lỗi xảy ra khi xử lý. Vui lòng thử lại.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Tên sản phẩm
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="unitPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Giá
        </label>
        <input
          type="number"
          id="unitPrice"
          name="unitPrice"
          min="0"
          step="1000"
          value={formData.unitPrice}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.unitPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700"
        >
          Danh mục
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hình ảnh sản phẩm
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover border rounded"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 border rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">Chưa có ảnh</span>
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Chọn ảnh
            </label>
            {imageFile && (
              <p className="mt-1 text-sm text-gray-500">
                {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={uploadingImage}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={uploadingImage}
        >
          {uploadingImage
            ? "Đang tải ảnh lên..."
            : product
            ? "Cập nhật"
            : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
