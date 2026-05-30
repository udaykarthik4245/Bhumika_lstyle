'use client';

import { Star } from 'lucide-react';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  brand: string | null;
}

interface FiltersProps {
  state: FilterState;
  setState: (next: FilterState) => void;
  brands: string[];
  priceMax: number;
  onClear: () => void;
}

export function Filters({ state, setState, brands, priceMax, onClear }: FiltersProps) {
  return (
    <aside className="card p-4 sticky top-32 self-start">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={onClear} className="text-xs text-brand-500 hover:underline">
          Clear All
        </button>
      </div>

      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        <section>
          <h3 className="text-sm font-medium mb-2">Category</h3>
          <div className="space-y-1">
            <button
              onClick={() => setState({ ...state, category: null })}
              className={cn(
                'block w-full text-left text-sm px-2 py-1 rounded',
                state.category === null
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setState({ ...state, category: c.slug })}
                className={cn(
                  'block w-full text-left text-sm px-2 py-1 rounded',
                  state.category === c.slug
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-2">Price</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>₹{state.minPrice}</span>
            <span className="text-slate-400">—</span>
            <span>₹{state.maxPrice}</span>
          </div>
          <input
            type="range"
            min={0}
            max={priceMax}
            step={100}
            value={state.maxPrice}
            onChange={(e) =>
              setState({ ...state, maxPrice: Number(e.target.value) })
            }
            className="w-full mt-2 accent-brand-500"
          />
        </section>

        <section>
          <h3 className="text-sm font-medium mb-2">Rating</h3>
          <div className="space-y-1">
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="rating"
                  checked={state.minRating === r}
                  onChange={() => setState({ ...state, minRating: r })}
                  className="accent-brand-500"
                />
                <span className="flex items-center gap-1">
                  {r}+ <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="rating"
                checked={state.minRating === 0}
                onChange={() => setState({ ...state, minRating: 0 })}
                className="accent-brand-500"
              />
              Any
            </label>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-2">Availability</h3>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={state.inStockOnly}
              onChange={(e) => setState({ ...state, inStockOnly: e.target.checked })}
              className="accent-brand-500"
            />
            In stock only
          </label>
        </section>

        {brands.length > 0 && (
          <section>
            <h3 className="text-sm font-medium mb-2">Brand</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button
                onClick={() => setState({ ...state, brand: null })}
                className={cn(
                  'block w-full text-left text-sm px-2 py-1 rounded',
                  state.brand === null
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setState({ ...state, brand: b })}
                  className={cn(
                    'block w-full text-left text-sm px-2 py-1 rounded',
                    state.brand === b
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
