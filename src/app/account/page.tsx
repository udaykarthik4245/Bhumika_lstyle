'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AccountPage() {
  const { user, updateProfile, orders } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    toast.show('Profile updated');
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Profile Information</h2>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <input
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input className="input" value={user.email} disabled />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Phone</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Orders" value={orders.length} />
        <Stat label="Saved Addresses" value={user.addresses.length} />
        <Stat label="Account Type" value={user.role === 'admin' ? 'Admin' : 'Customer'} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
