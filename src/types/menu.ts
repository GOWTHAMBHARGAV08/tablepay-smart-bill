export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main Course' | 'Desserts' | 'Beverages';
  price: number;
  description: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Bill {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  serviceCharge: number;
  total: number;
}

export interface Customer {
  name: string;
  tableNumber: string;
  contact: string;
}

export type UserRole = 'admin' | 'cashier';

export interface User {
  username: string;
  role: UserRole;
}
