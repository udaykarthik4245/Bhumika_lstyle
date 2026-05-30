'use client';

import { useEffect, useState } from 'react';
import { useAllOrders } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';
import { Order } from '@/lib/types';

const ORDERS_KEY = 'bhumika:orders';

export default function AdminOrdersPage() {
  const orders = useAllOrders();
  const toast = useToast();
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [local, setLocal] = useState<Order[]>([]);

  useEffect(() => setLocal(orders), [orders]);

  const visible = filter === 'all' ? local : local.filter((o) => o.status === filter);

  const updateStatus = (id: string, status: Order['status']) => {
    const next = local.map((o) => (o.id === id ? { ...o, status } : o));
    setLocal(next);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    toast.show(`Order marked as ${status}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filter:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="input max-w-[180px]"
        >
          <option value="all">All Orders</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">
          No orders to show.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">Order ID</p>
                  <p className="font-mono text-sm">{o.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="text-sm">{o.address.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="font-semibold">{formatINR(o.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="text-sm">{new Date(o.placedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Payment</p>
                  <p className="text-sm uppercase">{o.paymentMethod}</p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                  className="input max-w-[140px] py-1"
                >
                  <option value="placed">Placed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mt-3 grid sm:grid-cols-[1fr_auto] gap-4">
                <div className="space-y-1">
                  {o.items.map((it) => (
                    <p key={it.productId} className="text-sm">
                      {it.name}{' '}
                      <span className="text-slate-500">
                        × {it.quantity} ({formatINR(it.price)})
                      </span>
                    </p>
                  ))}
                </div>
                <div className="text-xs text-slate-500 max-w-xs">
                  <p className="font-medium text-slate-700 dark:text-slate-300 mb-0.5">Ship to</p>
                  {o.address.line1}, {o.address.city}, {o.address.state} - {o.address.pincode}
                  <br />
                  Phone: {o.address.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
