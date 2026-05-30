'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  Minus,
  Plus,
} from 'lucide-react';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { ProductCard } from '@/components/ProductCard';
import { calcDiscount, formatINR, cn } from '@/lib/utils';
import { getCategoryById } from '@/lib/categories';

interface PageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const { products } = useAdminProducts();
  const product = products.find((p) => p.id === params.id);
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description');

  if (!product) return notFound();

  const cat = getCategoryById(product.categoryId);
  const discount = calcDiscount(product.mrp, product.price);
  const inWishlist = wishlist.has(product.id);
  const outOfStock = product.stock <= 0;
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-brand-500">
          Home
        </Link>
        {' / '}
        {cat && (
          <>
            <Link href={`/products?category=${cat.slug}`} className="hover:text-brand-500">
              {cat.name}
            </Link>
            {' / '}
          </>
        )}
        <span className="text-slate-700 dark:text-slate-300">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/800x800?text=${encodeURIComponent(product.brand)}`;
              }}
            />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'w-20 h-20 rounded border-2 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0',
                  i === activeImage ? 'border-brand-500' : 'border-transparent'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-slate-500">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-xs text-slate-500">
              {product.ratingCount.toLocaleString()} ratings · {product.reviews.length} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold">{formatINR(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-sm text-slate-500 line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-sm text-emerald-600 font-semibold">
                  {discount}% off
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>

          {/* Stock indicator */}
          <p className="mt-4 text-sm">
            {outOfStock ? (
              <span className="text-red-500 font-medium">Out of Stock</span>
            ) : product.stock < 10 ? (
              <span className="text-orange-500 font-medium">Only {product.stock} left!</span>
            ) : (
              <span className="text-emerald-600 font-medium">In Stock</span>
            )}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-5">
            <span className="text-sm">Qty:</span>
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <button
              disabled={outOfStock}
              onClick={() => {
                cart.addItem({ productId: product.id, quantity: qty });
                toast.show(`Added ${qty} item(s) to cart`);
              }}
              className="btn-primary flex-1"
            >
              <ShoppingBag className="w-4 h-4" />
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              disabled={outOfStock}
              onClick={() => {
                cart.addItem({ productId: product.id, quantity: qty });
                router.push('/checkout');
              }}
              className="btn bg-orange-500 hover:bg-orange-600 text-white flex-1 disabled:opacity-50"
            >
              Buy Now
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

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
            {[
              { icon: Truck, label: 'Free Delivery' },
              { icon: RefreshCw, label: '30-Day Returns' },
              { icon: ShieldCheck, label: 'Secure Payment' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-3 rounded border border-slate-200 dark:border-slate-800"
              >
                <Icon className="w-5 h-5 text-brand-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {(['description', 'specs', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors',
                tab === t
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {t === 'specs' ? 'Specifications' : t === 'reviews' ? `Reviews (${product.reviews.length})` : 'Description'}
            </button>
          ))}
        </div>
        <div className="py-6 animate-fade-in">
          {tab === 'description' && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          )}
          {tab === 'specs' && (
            <table className="w-full max-w-xl text-sm">
              <tbody>
                {Object.entries(product.specifications).map(([k, v]) => (
                  <tr
                    key={k}
                    className="border-b border-slate-200 dark:border-slate-800"
                  >
                    <td className="py-2 pr-4 text-slate-500 w-1/3">{k}</td>
                    <td className="py-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'reviews' && (
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div
                  key={r.id}
                  className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-emerald-600 text-white text-xs px-1.5 rounded flex items-center gap-0.5">
                      {r.rating.toFixed(1)} <Star className="w-3 h-3 fill-white" />
                    </div>
                    <span className="font-medium text-sm">{r.title}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{r.comment}</p>
                  <p className="text-xs text-slate-500">
                    {r.user} · {r.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
