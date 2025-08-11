import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart, Loader2, Package } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ id, name, price, imageUrl, categoryName, description }) => {
    const { addItemToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated()) {
          toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
          return;
        }

        try {
          setLoading(true);
          await addItemToCart(id, 1);
          toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        } catch (error) {
          console.error("Lỗi khi thêm vào giỏ hàng:", error);
          toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
        } finally {
          setLoading(false);
        }
      },
      [addItemToCart, id, isAuthenticated]
    );

    const formatPrice = useCallback((amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }, []);

    return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <Link to={`/products/${id}`} className="block">
          <div className="aspect-square overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardHeader className="pb-2">
            {categoryName && (
              <Badge variant="secondary" className="w-fit mb-2">
                {categoryName}
              </Badge>
            )}
            <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            {description && (
              <CardDescription className="line-clamp-2 text-sm">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </div>
          </CardContent>
        </Link>
        <CardFooter className="pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Thêm vào giỏ hàng
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
