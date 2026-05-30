'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '@/lib/types';
import { products as seedProducts } from '@/lib/mockProducts';
import { generateId } from '@/lib/utils';

// Admin can mutate the catalog. We persist overrides locally so changes
// survive a refresh; reads from the rest of the app fall through to mockProducts
// — for demo simplicity, the catalog page reads from this provider too.

interface AdminProductsValue {
  products: Product[];
  add: (p: Omit<Product, 'id' | 'slug' | 'reviews' | 'createdAt'>) => Product;
  update: (id: string, patch: Partial<Product>) => void;
  remove: (id: string) => void;
  reset: () => void;
}

const AdminProductsContext = createContext<AdminProductsValue | null>(null);
const KEY = 'bhumika:catalog';

export function AdminProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProducts(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  const add: AdminProductsValue['add'] = (p) => {
    const id = generateId('prd');
    const newProduct: Product = {
      ...p,
      id,
      slug: id,
      reviews: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const update: AdminProductsValue['update'] = (id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const remove: AdminProductsValue['remove'] = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const reset = () => {
    setProducts(seedProducts);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  return (
    <AdminProductsContext.Provider value={{ products, add, update, remove, reset }}>
      {children}
    </AdminProductsContext.Provider>
  );
}

export function useAdminProducts() {
  const ctx = useContext(AdminProductsContext);
  if (!ctx) throw new Error('useAdminProducts must be used within AdminProductsProvider');
  return ctx;
}
