import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Menu items cho user
  const menuItems = [
    { path: "/user", label: "Trang cá nhân", icon: "👤" },
    { path: "/user/orders", label: "Đơn hàng của tôi", icon: "🛒" },
    { path: "/user/favorites", label: "Sản phẩm yêu thích", icon: "❤️" },
    { path: "/user/settings", label: "Cài đặt tài khoản", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold">Khu vực cá nhân</h1>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm">
                  Xin chào, <span className="font-medium">{user.username}</span>
                </span>
                <Link to="/" className="text-sm hover:underline">
                  Trang chủ
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-4">Menu cá nhân</h2>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center p-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <NavLink
                    to="/user/addresses"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded text-sm ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    Địa chỉ
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Content area */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
