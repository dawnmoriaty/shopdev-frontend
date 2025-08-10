import { useState, useCallback, useEffect } from "react";
import { Minus, Plus, Trash2, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/types/cart";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (itemId: number, selected: boolean) => void;
  compact?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  isSelectable = false,
  isSelected = false,
  onSelectionChange,
  compact = false,
}) => {
  const { updateItem, removeItem, loading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Debounce quantity updates to avoid too many API calls
  const debouncedQuantity = useDebounce(quantity, 500);

  const handleUpdateQuantity = useCallback(
    async (newQuantity: number) => {
      if (newQuantity === item.quantity || newQuantity <= 0) return;

      setIsUpdating(true);
      try {
        console.log(
          "Updating quantity for item:",
          item.id,
          "from",
          item.quantity,
          "to",
          newQuantity
        );
        await updateItem(item.id, newQuantity);
        toast.success("Cập nhật số lượng thành công");
      } catch (error) {
        console.error("Update quantity error:", error);
        setQuantity(item.quantity); // Reset on error
        toast.error("Không thể cập nhật số lượng");
      } finally {
        setIsUpdating(false);
      }
    },
    [item.id, item.quantity, updateItem]
  );

  // Update quantity when debounced value changes
  useEffect(() => {
    if (
      debouncedQuantity !== item.quantity &&
      debouncedQuantity > 0 &&
      !isUpdating
    ) {
      handleUpdateQuantity(debouncedQuantity);
    }
  }, [debouncedQuantity, handleUpdateQuantity, item.quantity, isUpdating]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 999) {
      setQuantity(newQuantity);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(item.id);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(value);
  };

  const totalPrice = item.productPrice * quantity;
  const isItemLoading = loading || isUpdating;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <img
          src={item.productImage || "/placeholder.png"}
          alt={item.productName}
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.productName}
          </p>
          <p className="text-xs text-gray-600">
            {quantity} x {formatPrice(item.productPrice)}
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {formatPrice(totalPrice)}
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Checkbox for selection */}
          {isSelectable && (
            <div className="p-4 flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectionChange?.(item.id, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          )}

          {/* Product Image */}
          <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
            <img
              src={item.productImage || "/placeholder.png"}
              alt={item.productName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {isItemLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {item.productName}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Trong giỏ hàng
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="text-lg font-bold text-red-600">
                {formatPrice(item.productPrice)}
              </div>
              <div className="text-sm text-gray-600">
                Tổng:{" "}
                <span className="font-semibold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Quantity Controls & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isItemLoading}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={handleInputChange}
                    disabled={isItemLoading}
                    className="h-8 w-16 text-center border-0 border-x"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleIncrement}
                    disabled={quantity >= 999 || isItemLoading}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  disabled={isItemLoading}
                  className={`h-8 w-8 p-0 ${
                    isFavorite ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isItemLoading}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
