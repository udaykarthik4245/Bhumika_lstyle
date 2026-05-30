'use client';

import { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Address } from '@/lib/types';

export default function AddressesPage() {
  const { user, addAddress, removeAddress, setDefaultAddress } = useAuth();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
  });

  if (!user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(form);
    setShowForm(false);
    setForm({
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home',
    });
    toast.show('Address saved');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Saved Addresses</h2>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card p-5 grid grid-cols-2 gap-3 animate-slide-down">
          <input
            placeholder="Name *"
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Phone *"
            required
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Address Line 1 *"
            required
            className="input col-span-2"
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
          />
          <input
            placeholder="Address Line 2"
            className="input col-span-2"
            value={form.line2}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
          />
          <input
            placeholder="City"
            required
            className="input"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            placeholder="State"
            required
            className="input"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <input
            placeholder="Pincode *"
            required
            className="input"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
          <select
            className="input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Address['type'] })}
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {user.addresses.length === 0 && !showForm && (
        <div className="card p-8 text-center text-sm text-slate-500">
          No saved addresses yet.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {user.addresses.map((a) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{a.name}</p>
                <span className="text-xs uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {a.type}
                </span>
                {a.isDefault && (
                  <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  removeAddress(a.id);
                  toast.show('Address removed', 'info');
                }}
                className="text-slate-400 hover:text-red-500"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {a.line1}
              {a.line2 && `, ${a.line2}`}
              <br />
              {a.city}, {a.state} - {a.pincode}
              <br />
              Phone: {a.phone}
            </p>
            {!a.isDefault && (
              <button
                onClick={() => {
                  setDefaultAddress(a.id);
                  toast.show('Default address updated');
                }}
                className="text-xs text-brand-500 hover:underline mt-2 flex items-center gap-1"
              >
                <Star className="w-3 h-3" /> Set as Default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
