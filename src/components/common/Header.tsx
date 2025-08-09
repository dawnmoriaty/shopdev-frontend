import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

const Header = () => {
  const { isAuthenticated, isAdmin, isUser, logout, user } = useAuth();
  const { getTotalItems, getCart } = useCart();
  const navigate = useNavigate();

  const authenticated = isAuthenticated();

  // Lấy giỏ hàng khi component mount
  useEffect(() => {
    if (authenticated) {
      getCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]); // Tránh đưa isAuthenticated (function) vào deps

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Shop Dev
          </Link>

          {/* Các liên kết điều hướng chính */}
          <nav className="ml-10 space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900">
              Sản phẩm
            </Link>
          </nav>
        </div>

        {/* Phần đăng nhập/đăng ký/đăng xuất */}
        <div className="flex items-center space-x-4">
          {isAuthenticated() ? (
            <div className="flex items-center space-x-4">
              {/* Icon giỏ hàng */}
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              <span className="text-sm text-gray-700">
                Xin chào, <span className="font-medium">{user?.username}</span>
              </span>

              {isAdmin() && (
                <Link
                  to="/admin"
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Admin Dashboard
                </Link>
              )}

              {isUser() && (
                <Link
                  to="/user"
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Trang cá nhân
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
