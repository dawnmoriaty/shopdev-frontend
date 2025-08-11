import { useEffect, useState, useCallback } from "react";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import ProductForm from "./ProductForm";
import type { Product, ProductRequest } from "@/types/product";
import type { Category } from "@/types/category";
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
import { Pencil, Trash2, Plus, Loader2, Package } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshing]);

  const handleCreateProduct = useCallback(
    async (productData: ProductRequest) => {
      try {
        setLoading(true);
        await productService.createProduct(productData);
        setShowForm(false);
        setRefreshing((prev) => prev + 1);
        toast.success("Thêm sản phẩm thành công!");
      } catch (err) {
        console.error("Error creating product:", err);
        toast.error("Có lỗi xảy ra khi thêm sản phẩm");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleUpdateProduct = useCallback(
    async (productData: ProductRequest) => {
      if (!selectedProduct) return;

      try {
        setLoading(true);
        await productService.updateProduct(selectedProduct.id, productData);
        setShowForm(false);
        setSelectedProduct(null);
        setRefreshing((prev) => prev + 1);
        toast.success("Cập nhật sản phẩm thành công!");
      } catch (err) {
        console.error("Error updating product:", err);
        toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
      } finally {
        setLoading(false);
      }
    },
    [selectedProduct]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (productToDelete === null) return;

    try {
      setLoading(true);
      await productService.deleteProduct(productToDelete);
      setShowDeleteModal(false);
      setProductToDelete(null);
      setRefreshing((prev) => prev + 1);
      toast.success("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [productToDelete]);

  const handleEditClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    (productData: ProductRequest) => {
      if (selectedProduct) {
        handleUpdateProduct(productData);
      } else {
        handleCreateProduct(productData);
      }
    },
    [selectedProduct, handleUpdateProduct, handleCreateProduct]
  );

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Quản lý sản phẩm
            </CardTitle>
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm sản phẩm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && products.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không có sản phẩm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.id}</TableCell>
                      <TableCell>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.categoryName}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(product.unitPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setProductToDelete(product.id);
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct || undefined}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedProduct(null);
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
              Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteModal(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
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

export default ProductsPage;
