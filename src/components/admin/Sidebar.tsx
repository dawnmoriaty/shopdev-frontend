import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Menu items
  const menuItems = [
    { 
      path: "/admin", 
      label: "Dashboard", 
      icon: "🏠",
      exact: true 
    },
    { 
      path: "/admin/products", 
      label: "Sản phẩm", 
      icon: "📦" 
    },
    { 
      path: "/admin/categories", 
      label: "Danh mục", 
      icon: "📑" 
    },
    { 
      path: "/admin/orders", 
      label: "Đơn hàng", 
      icon: "🛒" 
    },
    { 
      path: "/admin/users", 
      label: "Người dùng", 
      icon: "👥" 
    },
  ];

  // Kiểm tra đường dẫn hiện tại có khớp với menu item không
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen overflow-y-auto fixed left-0 top-0">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Link to="/" className="text-sm text-gray-400 hover:text-white mt-1 inline-block">
          Về trang chủ →
        </Link>
      </div>
      
      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={clsx(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  isActive(item.path, item.exact) 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-300 hover:bg-gray-700"
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <span className="mr-3 text-lg">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;