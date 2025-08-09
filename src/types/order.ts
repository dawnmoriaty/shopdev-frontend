export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface Order {
  id: number;
  serialNumber: string;
  userId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}