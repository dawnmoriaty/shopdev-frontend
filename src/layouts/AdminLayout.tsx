import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="flex items-center">
              {user && (
                <span className="text-sm text-gray-700">
                  Đang đăng nhập với{" "}
                  <span className="font-medium">{user.username}</span>
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
