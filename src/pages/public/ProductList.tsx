import React, { useEffect, useState, useCallback, useMemo } from "react";
import { productService } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import type { Product } from "@/types/product";
import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/category";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Package, Filter } from "lucide-react";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProducts(),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch products by category
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let data: Product[] = [];

      if (selectedCategory && selectedCategory !== 0) {
        data = await productService.getProductsByCategoryId(selectedCategory);
      } else {
        data = await productService.getAllProducts();
      }

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [fetchProducts, categories.length]);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [products, debouncedSearch]);

  const handleCategoryChange = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Package className="h-8 w-8" />
          Danh sách sản phẩm
        </h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h2 className="font-medium">Lọc theo danh mục</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  selectedCategory === 0 || selectedCategory === null
                    ? "default"
                    : "outline"
                }
                onClick={() => handleCategoryChange(0)}
                size="sm"
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => handleCategoryChange(category.id)}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {!loading && (
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} sản phẩm
            {selectedCategory && selectedCategory !== 0 && (
              <span className="ml-1">
                trong danh mục{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
          </Badge>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-muted-foreground mb-4">
              {search ? "Thử từ khóa khác hoặc " : ""}
              Hãy thử lọc theo danh mục khác
            </p>
            {search && (
              <Button onClick={() => setSearch("")} variant="outline">
                Xóa bộ lọc
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.unitPrice}
              imageUrl={product.imageUrl}
              categoryName={product.categoryName}
              description={product.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
