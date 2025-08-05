import React from "react";

const ProductList: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Các sản phẩm sẽ được render ở đây */}
        <div className="text-center">Đang tải sản phẩm...</div>
      </div>
    </div>
  );
};

export default ProductList;
