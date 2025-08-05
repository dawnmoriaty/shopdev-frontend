import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isAuthenticated, isAdmin, isUser, logout, user } = useAuth();
  const navigate = useNavigate();

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
