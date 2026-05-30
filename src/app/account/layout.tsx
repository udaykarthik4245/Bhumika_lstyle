'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait briefly for hydration before redirecting unauthenticated visitors.
    const t = setTimeout(() => {
      if (!user) router.push('/login?next=' + encodeURIComponent(pathname));
    }, 100);
    return () => clearTimeout(t);
  }, [user, pathname, router]);

  if (!user) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading…</div>;
  }

  const links = [
    { href: '/account', label: 'Profile', icon: User },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
    { href: '/account/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="card p-3 h-fit">
          <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-800 mb-2">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
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
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
