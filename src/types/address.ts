export interface Address {
  id: number;
  receiveName: string;
  phone: string;
  address: string;
  userId: number;
}

export interface AddressRequest {
  receiveName: string;
  phone: string;
  address: string;
}