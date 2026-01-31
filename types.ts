
export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE = 'MOBILE'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  sku: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalPurchase: number;
  dues: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  profit: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  invoiceNumber: string;
}

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
}

export type Language = 'en' | 'bn';

export interface AppState {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  currentUser: User | null;
  language: Language;
}
