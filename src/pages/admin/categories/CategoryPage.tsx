import { useEffect, useState } from 'react';
import { categoryService } from '../../../services/categoryService';
import CategoryForm from './CategoryForm';
import type { Category, CategoryRequest } from '@/types/category';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách categories khi component mount hoặc refreshing thay đổi
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshing]);

  // Xử lý thêm mới danh mục
  const handleCreateCategory = async (categoryData: CategoryRequest) => {
    try {
      setLoading(true);
      await categoryService.createCategory(categoryData);
      setShowForm(false);
      // Refresh lại danh sách
      setRefreshing(prev => prev + 1);
      alert('Thêm danh mục thành công!');
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Có lỗi xảy ra khi thêm danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật danh mục
  const handleUpdateCategory = async (categoryData: CategoryRequest) => {
    if (!selectedCategory) return;
    
    try {
      setLoading(true);
      await categoryService.updateCategory(selectedCategory.id, categoryData);
      setShowForm(false);
      setSelectedCategory(null);
      // Refresh lại danh sách
      setRefreshing(prev => prev + 1);
      alert('Cập nhật danh mục thành công!');
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = async () => {
    if (categoryToDelete === null) return;
    
    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryToDelete);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      // Refresh lại danh sách
      setRefreshing(prev => prev + 1);
      alert('Xóa danh mục thành công!');
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Có lỗi xảy ra khi xóa danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi trạng thái danh mục
  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true);
      await categoryService.updateCategoryStatus(id, !currentStatus);
      // Refresh lại danh sách
      setRefreshing(prev => prev + 1);
    } catch (err) {
      console.error('Error updating category status:', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Mở form để sửa danh mục
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  // Xử lý form submit
  const handleFormSubmit = (categoryData: CategoryRequest) => {
    if (selectedCategory) {
      handleUpdateCategory(categoryData);
    } else {
      handleCreateCategory(categoryData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Thêm danh mục mới
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên danh mục</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Không có danh mục nào</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{category.id}</td>
                    <td className="py-3 px-4">{category.name}</td>
                    <td className="py-3 px-4">{category.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={category.status}
                            onChange={() => handleStatusChange(category.id, category.status)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(category.id);
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )};
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>
            <CategoryForm
              category={selectedCategory || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedCategory(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xóa danh mục này không?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteCategory}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;