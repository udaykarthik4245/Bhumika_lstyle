'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { categories } from '@/lib/categories';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Product } from '@/lib/types';

export default function HomePage() {
  const { products } = useAdminProducts();
  const [quickView, setQuickView] = useState<Product | null>(null);

  const featured = [...products]
    .sort((a, b) => b.rating * b.ratingCount - a.rating * a.ratingCount)
    .slice(0, 8);

  const trending = [...products]
    .sort((a, b) => b.mrp - b.price - (a.mrp - a.price))
    .slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-slide-up">
            <span className="inline-block bg-brand-500/10 text-brand-600 px-3 py-1 rounded-full text-xs font-medium mb-4">
              ✨ WELCOME TO BHUMIKA STYLE STUDIO
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Style that <span className="text-brand-500">defines</span> you
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg max-w-md">
              Curated fashion, beauty, and home essentials — handpicked for the modern soul.
              Up to 60% off on top brands.
            </p>
            <div className="flex gap-3 mt-8">
              <Link href="/products" className="btn-primary">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products?category=women" className="btn-outline">
                Explore Women
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((c, i) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="relative aspect-[4/5] rounded-xl overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white font-semibold">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          {[
            { icon: Truck, label: 'Free Shipping', sub: 'Above ₹999' },
            { icon: RefreshCw, label: 'Easy Returns', sub: '30 day window' },
            { icon: ShieldCheck, label: 'Secure Payments', sub: '100% protected' },
            { icon: Headphones, label: '24x7 Support', sub: 'We are here to help' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-brand-500" />
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link href="/products" className="text-sm text-brand-500 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-transparent group-hover:ring-brand-500 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <span className="text-xs text-center font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Picks</h2>
          <Link href="/products" className="text-sm text-brand-500 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-orange-500 p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold mb-2">Up to 60% off on Footwear</h3>
            <p className="opacity-90">Limited time offer. Hurry, while stocks last!</p>
          </div>
          <Link
            href="/products?category=footwear"
            className="bg-white text-brand-600 hover:bg-slate-100 px-6 py-3 rounded-md font-semibold transition"
          >
            Shop Footwear
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Best Deals</h2>
          <Link href="/products" className="text-sm text-brand-500 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      </section>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
