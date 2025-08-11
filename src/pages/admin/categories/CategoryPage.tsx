import { useEffect, useState, useCallback } from "react";
import { categoryService } from "../../../services/categoryService";
import CategoryForm from "./CategoryForm";
import type { Category, CategoryRequest } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Fetch categories with optimized error handling
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshing]);

  // Optimized handlers with toast notifications
  const handleCreateCategory = useCallback(
    async (categoryData: CategoryRequest) => {
      try {
        setLoading(true);
        await categoryService.createCategory(categoryData);
        setShowForm(false);
        setRefreshing((prev) => prev + 1);
        toast.success("Thêm danh mục thành công!");
      } catch (err) {
        console.error("Error creating category:", err);
        toast.error("Có lỗi xảy ra khi thêm danh mục");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleUpdateCategory = useCallback(
    async (categoryData: CategoryRequest) => {
      if (!selectedCategory) return;

      try {
        setLoading(true);
        await categoryService.updateCategory(selectedCategory.id, categoryData);
        setShowForm(false);
        setSelectedCategory(null);
        setRefreshing((prev) => prev + 1);
        toast.success("Cập nhật danh mục thành công!");
      } catch (err) {
        console.error("Error updating category:", err);
        toast.error("Có lỗi xảy ra khi cập nhật danh mục");
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

  const handleDeleteCategory = useCallback(async () => {
    if (categoryToDelete === null) return;

    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryToDelete);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setRefreshing((prev) => prev + 1);
      toast.success("Xóa danh mục thành công!");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Có lỗi xảy ra khi xóa danh mục");
    } finally {
      setLoading(false);
    }
  }, [categoryToDelete]);

  const handleStatusChange = useCallback(
    async (id: number, currentStatus: boolean) => {
      try {
        await categoryService.updateCategoryStatus(id, !currentStatus);
        setRefreshing((prev) => prev + 1);
        toast.success("Cập nhật trạng thái thành công!");
      } catch (err) {
        console.error("Error updating category status:", err);
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
      }
    },
    []
  );

  const handleEditClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    (categoryData: CategoryRequest) => {
      if (selectedCategory) {
        handleUpdateCategory(categoryData);
      } else {
        handleCreateCategory(categoryData);
      }
    },
    [selectedCategory, handleUpdateCategory, handleCreateCategory]
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Quản lý danh mục
            </CardTitle>
            <Button
              onClick={() => {
                setSelectedCategory(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm danh mục mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && categories.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không có danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-mono">{category.id}</TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {category.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={category.status}
                            onCheckedChange={() =>
                              handleStatusChange(category.id, category.status)
                            }
                          />
                          <Badge
                            variant={category.status ? "default" : "secondary"}
                          >
                            {category.status ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(category)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setCategoryToDelete(category.id);
                              setShowDeleteModal(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteModal(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryPage;
