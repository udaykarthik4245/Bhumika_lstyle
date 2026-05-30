'use client';

import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { calcDiscount, formatINR, cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    if (product) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [product, onClose]);

  if (!product) return null;
  const discount = calcDiscount(product.mrp, product.price);
  const inWishlist = wishlist.has(product.id);

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold">Quick View</h2>
          <button onClick={onClose} className="btn-ghost p-1.5" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(product.brand)}`;
                }}
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-16 h-16 rounded border-2 overflow-hidden bg-slate-100 dark:bg-slate-800',
                    i === activeImage ? 'border-brand-500' : 'border-transparent'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">{product.brand}</p>
            <h1 className="text-xl font-semibold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">
                <span>{product.rating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-slate-500">{product.ratingCount} ratings</span>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-2xl font-bold">{formatINR(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-slate-500 line-through">
                    {formatINR(product.mrp)}
                  </span>
                  <span className="text-sm text-emerald-600 font-semibold">{discount}% off</span>
                </>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 line-clamp-3">
              {product.description}
            </p>
            <div className="flex gap-2 mt-6">
              <button
                disabled={product.stock <= 0}
                onClick={() => {
                  cart.addItem({ productId: product.id, quantity: 1 });
                  toast.show('Added to cart');
                  onClose();
                }}
                className="btn-primary flex-1"
              >
                <ShoppingBag className="w-4 h-4" />{' '}
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => {
                  wishlist.toggle(product.id);
                  toast.show(
                    inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
                    inWishlist ? 'info' : 'success'
                  );
                }}
                className="btn-outline px-3"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={cn('w-4 h-4', inWishlist ? 'fill-brand-500 text-brand-500' : '')}
                />
              </button>
            </div>
            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="block text-center text-sm text-brand-500 mt-4 hover:underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
