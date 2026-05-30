'use client';

import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { calcDiscount, formatINR, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const wishlist = useWishlist();
  const cart = useCart();
  const toast = useToast();
  const inWishlist = wishlist.has(product.id);
  const discount = calcDiscount(product.mrp, product.price);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group card hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-fade-in">
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={cn(
              'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
              outOfStock && 'opacity-50 grayscale'
            )}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.src = `https://placehold.co/600x800?text=${encodeURIComponent(product.brand)}`;
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
          {outOfStock && (
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/70 text-white text-center text-sm py-1.5 font-semibold">
              Out of Stock
            </span>
          )}

          {/* Hover actions */}
          <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                wishlist.toggle(product.id);
                toast.show(
                  inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
                  inWishlist ? 'info' : 'success'
                );
              }}
              className="bg-white dark:bg-slate-900 rounded-full p-2 shadow hover:scale-110 transition-transform"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={cn('w-4 h-4', inWishlist ? 'fill-brand-500 text-brand-500' : '')}
              />
            </button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="bg-white dark:bg-slate-900 rounded-full p-2 shadow hover:scale-110 transition-transform"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <p className="text-xs text-slate-500 mb-0.5">{product.brand}</p>
          <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem] hover:text-brand-500">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5 bg-emerald-600 text-white text-xs px-1.5 rounded">
            <span>{product.rating.toFixed(1)}</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
          <span className="text-xs text-slate-500">({product.ratingCount})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-semibold">{formatINR(product.price)}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-slate-500 line-through">
                {formatINR(product.mrp)}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">{discount}% off</span>
            </>
          )}
        </div>

        <button
          disabled={outOfStock}
          onClick={() => {
            cart.addItem({ productId: product.id, quantity: 1 });
            toast.show('Added to cart');
          }}
          className="btn-outline w-full mt-3 text-sm py-1.5"
        >
          <ShoppingBag className="w-4 h-4" /> {outOfStock ? 'Notify Me' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
