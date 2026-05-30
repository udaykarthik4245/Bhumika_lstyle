'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { ProductCard } from '@/components/ProductCard';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { products } = useAdminProducts();
  const items = products.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700" />
        <h1 className="text-2xl font-bold mt-4">Your wishlist is empty</h1>
        <p className="text-slate-500 mt-2">Save your favorite items to find them later.</p>
        <Link href="/products" className="btn-primary inline-flex mt-6">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
