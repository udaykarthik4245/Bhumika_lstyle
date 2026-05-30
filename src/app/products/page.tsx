'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { Filters, FilterState } from '@/components/Filters';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Product } from '@/lib/types';
import { categories } from '@/lib/categories';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

function CatalogContent() {
  const search = useSearchParams();
  const { products } = useAdminProducts();

  const initialCategory = search.get('category');
  const query = search.get('q') || '';

  const priceMax = useMemo(
    () => Math.max(...products.map((p) => p.mrp), 5000),
    [products]
  );

  const [filter, setFilter] = useState<FilterState>({
    category: initialCategory,
    minPrice: 0,
    maxPrice: priceMax,
    minRating: 0,
    inStockOnly: false,
    brand: null,
  });
  const [sort, setSort] = useState<SortKey>('popular');
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Re-sync filter when URL ?category= changes
  useEffect(() => {
    setFilter((f) => ({ ...f, category: initialCategory, maxPrice: priceMax }));
  }, [initialCategory, priceMax]);

  // Simulate fetch latency so the skeleton loaders are visible — also
  // matches what real network behavior would feel like.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [filter, sort, query]);

  const visible = useMemo(() => {
    let list = [...products];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (filter.category) {
      const cat = categories.find((c) => c.slug === filter.category);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }
    list = list.filter(
      (p) => p.price >= filter.minPrice && p.price <= filter.maxPrice
    );
    if (filter.minRating) list = list.filter((p) => p.rating >= filter.minRating);
    if (filter.inStockOnly) list = list.filter((p) => p.stock > 0);
    if (filter.brand) list = list.filter((p) => p.brand === filter.brand);

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        list.sort(
          (a, b) =>
            (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
        );
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.ratingCount - a.ratingCount);
    }
    return list;
  }, [products, filter, sort, query]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    const cat = filter.category ? categories.find((c) => c.slug === filter.category) : null;
    products.forEach((p) => {
      if (!cat || p.categoryId === cat.id) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products, filter.category]);

  const clearFilters = () =>
    setFilter({
      category: null,
      minPrice: 0,
      maxPrice: priceMax,
      minRating: 0,
      inStockOnly: false,
      brand: null,
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {query
              ? `Results for "${query}"`
              : filter.category
                ? categories.find((c) => c.slug === filter.category)?.name
                : 'All Products'}
          </h1>
          <p className="text-sm text-slate-500">{visible.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="btn-outline lg:hidden text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input max-w-[180px] py-1.5"
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="discount">Discount</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Desktop filters */}
        <div className="hidden lg:block">
          <Filters
            state={filter}
            setState={setFilter}
            brands={brands}
            priceMax={priceMax}
            onClear={clearFilters}
          />
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 z-[70] bg-black/50 lg:hidden animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white dark:bg-slate-950 overflow-y-auto p-4 animate-slide-down"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="btn-ghost p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Filters
                state={filter}
                setState={setFilter}
                brands={brands}
                priceMax={priceMax}
                onClear={clearFilters}
              />
            </div>
          </div>
        )}

        {/* Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-semibold mb-1">No products found</p>
              <p className="text-sm text-slate-500 mb-4">Try adjusting your filters or search.</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">Loading…</div>}>
      <CatalogContent />
    </Suspense>
  );
}
