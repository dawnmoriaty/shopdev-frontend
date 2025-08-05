export interface Product {
  id: number;
  sku: string; 
  name: string;
  description: string;
  unitPrice: number; 
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  categoryId: number;
}
