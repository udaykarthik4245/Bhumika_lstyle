'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) {
        router.push('/login?next=/admin');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }, 100);
    return () => clearTimeout(t);
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading…</div>;
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Link href="/" className="btn-outline text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card p-3 h-fit">
          <nav className="flex flex-col gap-0.5 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded',
                  pathname === l.href
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
