'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';

function OrdersList() {
  const { orders } = useAuth();
  const search = useSearchParams();
  const placedId = search.get('placed');
  const placedOrder = orders.find((o) => o.id === placedId);

  if (orders.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
        <h2 className="font-semibold mt-3">No orders yet</h2>
        <p className="text-sm text-slate-500 mt-1">When you place an order, it will appear here.</p>
        <Link href="/products" className="btn-primary inline-flex mt-4">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {placedOrder && (
        <div className="card p-5 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 animate-scale-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="font-semibold">Order placed successfully!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Order ID: <span className="font-mono">{placedOrder.id}</span> · Total{' '}
                {formatINR(placedOrder.total)}
              </p>
            </div>
          </div>
        </div>
      )}
      {orders.map((o) => (
        <div key={o.id} className="card p-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500">Order ID</p>
              <p className="font-mono text-sm">{o.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Placed</p>
              <p className="text-sm">{new Date(o.placedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="font-semibold">{formatINR(o.total)}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded uppercase ${o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
            >
              {o.status}
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {o.items.map((it) => (
              <div key={it.productId} className="flex items-center gap-3">
                <div className="w-12 h-16 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{it.name}</p>
                  <p className="text-xs text-slate-500">
                    Qty: {it.quantity} · {formatINR(it.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Shipping to: {o.address.line1}, {o.address.city}, {o.address.state} - {o.address.pincode}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersList />
    </Suspense>
  );
}
