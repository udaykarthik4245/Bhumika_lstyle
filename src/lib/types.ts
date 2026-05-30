// Core domain types used across the app.
// Kept simple — mock data only, no DB.

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  price: number;
  mrp: number; // original price; discount = (mrp - price) / mrp
  rating: number;
  ratingCount: number;
  stock: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  reviews: ProductReview[];
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<CartItem & { name: string; price: number; image: string }>;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'card' | 'upi' | 'netbanking';
  address: Address;
  placedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string; // mock only, plaintext for demo
  addresses: Address[];
  role: 'customer' | 'admin';
}
