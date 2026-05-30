'use client';

import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { useToast } from '@/context/ToastContext';
import { categories } from '@/lib/categories';
import { formatINR, cn } from '@/lib/utils';
import { Product } from '@/lib/types';

interface FormState {
  id?: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  mrp: number;
  rating: number;
  ratingCount: number;
  stock: number;
  images: string;
  description: string;
  tags: string;
}

const emptyForm: FormState = {
  name: '',
  brand: '',
  categoryId: categories[0].id,
  price: 0,
  mrp: 0,
  rating: 4.0,
  ratingCount: 0,
  stock: 50,
  images: '',
  description: '',
  tags: '',
};

export default function AdminProductsPage() {
  const { products, add, update, remove } = useAdminProducts();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [filterCat, setFilterCat] = useState<string>('all');

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterCat !== 'all') list = list.filter((p) => p.categoryId === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.id.includes(q)
      );
    }
    return list.slice(0, 100);
  }, [products, search, filterCat]);

  const startEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      brand: p.brand,
      categoryId: p.categoryId,
      price: p.price,
      mrp: p.mrp,
      rating: p.rating,
      ratingCount: p.ratingCount,
      stock: p.stock,
      images: p.images.join('\n'),
      description: p.description,
      tags: p.tags.join(', '),
    });
    setShowForm(true);
  };

  const startNew = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand) {
      toast.show('Name and brand are required', 'error');
      return;
    }
    const payload = {
      name: form.name,
      brand: form.brand,
      categoryId: form.categoryId,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      rating: Number(form.rating),
      ratingCount: Number(form.ratingCount),
      stock: Number(form.stock),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      description: form.description,
      specifications: { Brand: form.brand },
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (payload.images.length === 0) {
      payload.images = [`https://placehold.co/600x800?text=${encodeURIComponent(form.brand)}`];
    }
    if (form.id) {
      update(form.id, payload);
      toast.show('Product updated');
    } else {
      add(payload);
      toast.show('Product added');
    }
    setShowForm(false);
  };

  const handleDelete = (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    remove(p.id);
    toast.show('Product deleted', 'info');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="input pl-9 max-w-xs"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="input max-w-[200px]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={startNew} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-500 bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cat = categories.find((c) => c.id === p.categoryId);
              return (
                <tr
                  key={p.id}
                  className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/100`;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-slate-500">{cat?.name}</td>
                  <td className="p-3">{formatINR(p.price)}</td>
                  <td
                    className={cn(
                      'p-3 font-medium',
                      p.stock < 10 ? 'text-orange-500' : p.stock === 0 ? 'text-red-500' : ''
                    )}
                  >
                    {p.stock}
                  </td>
                  <td className="p-3">
                    {p.rating.toFixed(1)} ({p.ratingCount})
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => startEdit(p)}
                      className="btn-ghost p-1.5 mr-1"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="btn-ghost p-1.5 text-red-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">No products found.</p>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <form
            onSubmit={submit}
            className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-semibold">{form.id ? 'Edit Product' : 'Add Product'}</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost p-1.5"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Name" className="col-span-2">
                <input
                  required
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Brand">
                <input
                  required
                  className="input"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <select
                  className="input"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price (₹)">
                <input
                  type="number"
                  className="input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </Field>
              <Field label="MRP (₹)">
                <input
                  type="number"
                  className="input"
                  value={form.mrp}
                  onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                />
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  className="input"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </Field>
              <Field label="Rating">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className="input"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                />
              </Field>
              <Field label="Image URLs (one per line)" className="col-span-2">
                <textarea
                  rows={3}
                  className="input"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Description" className="col-span-2">
                <textarea
                  rows={3}
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
              <Field label="Tags (comma-separated)" className="col-span-2">
                <input
                  className="input"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </Field>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {form.id ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
