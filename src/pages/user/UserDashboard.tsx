import React from "react";
import { useAuth } from "../../hooks/useAuth";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trang cá nhân</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>

        {user && (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Tên đăng nhập:</span>{" "}
              {user.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm yêu thích</h2>
          <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
