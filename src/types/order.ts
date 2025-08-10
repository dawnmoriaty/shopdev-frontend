export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface Order {
  id: number;
  serial?: string;
  serialNumber: string;
  userId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  orderItems?: OrderItem[];
}