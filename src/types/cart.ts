export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  productName: string;
  productImage: string;
  productPrice: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface QuantityRequest {
  quantity: number;
}