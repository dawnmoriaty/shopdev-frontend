import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UnauthorizedPage: React.FC = () => {
  const { isAdmin, isUser } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Không có quyền truy cập
          </h2>
          <p className="mt-2 text-gray-600">
            Bạn không có quyền truy cập vào trang này.
          </p>
        </div>
        <div className="mt-5">
          {isAdmin() && (
            <Link
              to="/admin"
              className="text-indigo-600 hover:text-indigo-500 mr-4"
            >
              Về trang Admin
            </Link>
          )}
          {isUser() && (
            <Link to="/user" className="text-indigo-600 hover:text-indigo-500">
              Về trang cá nhân
            </Link>
          )}
          {!isAdmin() && !isUser() && (
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
