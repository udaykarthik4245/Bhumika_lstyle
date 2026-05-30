'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { categories } from '@/lib/categories';
import { searchProducts } from '@/lib/mockProducts';
import { formatINR } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { itemCount } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestions = search.trim() ? searchProducts(search).slice(0, 6) : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link
              href="/"
              className="flex items-baseline gap-1 text-2xl font-bold tracking-tight text-brand-500 leading-none"
            >
              <span>Bhumika</span>
              <span className="font-light italic text-slate-700 dark:text-slate-300">Style</span>
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400 hidden sm:inline">
                Studio
              </span>
            </Link>
          </div>

          {/* Search */}
          <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xl">
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                type="search"
                placeholder="Search for products, brands and more"
                className="input pl-9"
              />
            </form>
            {searchOpen && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-slide-down">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.brand}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatINR(p.price)}</span>
                  </Link>
                ))}
                <button
                  onClick={(e) => submitSearch(e as any)}
                  className="w-full text-sm text-brand-500 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-800"
                >
                  See all results for "{search}"
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="btn-ghost p-2 hidden sm:inline-flex"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 card shadow-xl animate-slide-down"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                        <p className="font-medium text-sm">Hi, {user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm border-t border-slate-200 dark:border-slate-800"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/wishlist" className="btn-ghost p-2 relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="btn-ghost p-2 relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Categories row */}
        <nav className="hidden md:flex items-center gap-6 h-11 overflow-x-auto text-sm">
          <Link href="/products" className="hover:text-brand-500 whitespace-nowrap">
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="hover:text-brand-500 whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <form onSubmit={submitSearch} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search for products"
                className="input pl-9"
              />
            </form>
            <div className="flex flex-col gap-1">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                All Products
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                >
                  {c.name}
                </Link>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-800 mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
