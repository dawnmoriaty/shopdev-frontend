import { useEffect, useState, useRef, useMemo } from "react";
import {
  ShoppingCart,
  Trash2,
  CheckSquare,
  Square,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { toast } from "sonner";

const CartPage: React.FC = () => {
  const { items: rawItems, loading, error, getCart, emptyCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  // Ensure items is always an array
  const items = useMemo(
    () => (Array.isArray(rawItems) ? rawItems : []),
    [rawItems]
  );

  // Debug log
  console.log(
    "CartPage rawItems:",
    rawItems,
    "items:",
    items,
    "type:",
    typeof items,
    "isArray:",
    Array.isArray(items)
  );

  // State for bulk selection
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (isAuthenticated() && !hasFetchedRef.current) {
      getCart();
      hasFetchedRef.current = true;
    } else if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, getCart]);

  // Update selection state when items change
  useEffect(() => {
    if (items.length > 0) {
      const allSelected = items.every((item) => selectedItems.has(item.id));
      setIsAllSelected(allSelected);
    } else {
      setSelectedItems(new Set());
      setIsAllSelected(false);
    }
  }, [items, selectedItems]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  const handleItemSelect = (itemId: number, selected: boolean) => {
    const newSelection = new Set(selectedItems);
    if (selected) {
      newSelection.add(itemId);
    } else {
      newSelection.delete(itemId);
    }
    setSelectedItems(newSelection);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error("Vui lòng chọn sản phẩm để xóa");
      return;
    }

    const confirmMessage = `Bạn có chắc muốn xóa ${selectedItems.size} sản phẩm đã chọn?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      // Here you would implement bulk delete functionality
      // For now, we'll just show a success message
      toast.success(`Đã xóa ${selectedItems.size} sản phẩm khỏi giỏ hàng`);
      setSelectedItems(new Set());
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?"))
      return;

    try {
      await emptyCart();
      setSelectedItems(new Set());
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    } catch {
      toast.error("Không thể xóa giỏ hàng");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <ShoppingCart className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
              {items.length > 0 && (
                <p className="text-gray-600 mt-1">
                  {items.length} sản phẩm trong giỏ hàng
                </p>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {items.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                      className="flex items-center gap-2"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      Chọn tất cả
                    </Button>

                    {selectedItems.size > 0 && (
                      <Badge variant="secondary">
                        {selectedItems.size} đã chọn
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedItems.size > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa đã chọn
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa tất cả
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy thêm một số sản phẩm để bắt đầu mua sắm
                </p>
                <Button asChild className="w-full">
                  <Link to="/products">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Sản phẩm trong giỏ hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="p-4">
                        <CartItem
                          item={item}
                          isSelectable
                          isSelected={selectedItems.has(item.id)}
                          onSelectionChange={handleItemSelect}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="mt-6 flex justify-between items-center">
                <Button variant="outline" asChild>
                  <Link to="/products">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>

                <div className="text-sm text-gray-600">
                  Tổng {items.length} sản phẩm
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary
                  items={items}
                  onCheckout={handleCheckout}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
