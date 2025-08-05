import React from "react";
import { useParams } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chi tiết sản phẩm</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Đang tải thông tin sản phẩm ID: {id}...</p>
      </div>
    </div>
  );
};

export default ProductDetail;
