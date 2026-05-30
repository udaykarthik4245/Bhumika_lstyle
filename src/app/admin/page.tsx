'use client';

import { Package, ShoppingBag, IndianRupee, TrendingUp } from 'lucide-react';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { useAllOrders } from '@/context/AuthContext';
import { categories } from '@/lib/categories';
import { formatINR } from '@/lib/utils';

export default function AdminDashboard() {
  const { products } = useAdminProducts();
  const orders = useAllOrders();

  const revenue = orders.reduce(
    (s, o) => s + (o.status === 'cancelled' ? 0 : o.total),
    0
  );
  const lowStock = products.filter((p) => p.stock < 10).length;
  const ordersByStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const productsByCategory = categories.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.categoryId === c.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={IndianRupee} label="Total Revenue" value={formatINR(revenue)} hue="emerald" />
        <Stat icon={ShoppingBag} label="Total Orders" value={orders.length} hue="blue" />
        <Stat icon={Package} label="Total Products" value={products.length} hue="purple" />
        <Stat icon={TrendingUp} label="Low Stock" value={lowStock} hue="orange" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          {Object.keys(ordersByStatus).length === 0 ? (
            <p className="text-sm text-slate-500">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(ordersByStatus).map(([status, count]) => {
                const pct = (count / orders.length) * 100;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <div
                        className="h-full bg-brand-500 rounded transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">Products by Category</h2>
          <div className="space-y-2">
            {productsByCategory.map((c) => {
              const pct = products.length > 0 ? (c.count / products.length) * 100 : 0;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{c.name}</span>
                    <span className="text-slate-500">{c.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <div
                      className="h-full bg-emerald-500 rounded transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">
            No orders yet. Place a test order from the storefront to see analytics.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2">Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 font-mono text-xs">{o.id.slice(0, 14)}…</td>
                    <td>{o.address.name}</td>
                    <td>{formatINR(o.total)}</td>
                    <td>
                      <span className="capitalize text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {o.status}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {new Date(o.placedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hue: 'emerald' | 'blue' | 'purple' | 'orange';
}) {
  const map = {
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${map[hue]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}
