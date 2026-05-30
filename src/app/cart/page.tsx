'use client';

import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { formatINR } from '@/lib/utils';

export default function CartPage() {
  const cart = useCart();
  const { products } = useAdminProducts();
  const toast = useToast();

  const items = cart.items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.productId) }))
    .filter((x): x is { item: typeof x.item; product: NonNullable<typeof x.product> } => !!x.product);

  const subtotal = items.reduce((s, { item, product }) => s + product.price * item.quantity, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700" />
        <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-slate-500 mt-2">Add some products to get started.</p>
        <Link href="/products" className="btn-primary inline-flex mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cart.itemCount} items)</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {items.map(({ item, product }) => (
            <div key={item.productId} className="card p-4 flex gap-4 animate-fade-in">
              <Link href={`/products/${product.id}`} className="shrink-0">
                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/200?text=${encodeURIComponent(product.brand)}`;
                    }}
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`}>
                  <p className="text-xs text-slate-500">{product.brand}</p>
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-semibold">{formatINR(product.price)}</span>
                  <span className="text-xs text-slate-500 line-through">
                    {formatINR(product.mrp)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded">
                    <button
                      onClick={() => cart.updateQty(item.productId, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => cart.updateQty(item.productId, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      cart.removeItem(item.productId);
                      toast.show('Removed from cart', 'info');
                    }}
                    className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-5 h-fit lg:sticky lg:top-32">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? 'FREE' : formatINR(shipping)} />
            <Row label="Tax (5%)" value={formatINR(tax)} />
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 mt-3 pt-3 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full mt-4">
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="block text-center text-sm text-brand-500 mt-3 hover:underline"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}
