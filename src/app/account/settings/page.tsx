'use client';

import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Moon, Sun, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const toast = useToast();

  const clearLocalData = () => {
    const ok = window.confirm(
      'This will clear cart, wishlist, addresses, orders, and demo data from this browser. Continue?'
    );
    if (!ok) return;
    [
      'bhumika:cart',
      'bhumika:wishlist',
      'bhumika:user',
      'bhumika:users',
      'bhumika:orders',
      'bhumika:catalog',
      'bhumika:theme',
    ].forEach((k) => localStorage.removeItem(k));
    toast.show('Local data cleared. Reloading...');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-slate-500">Choose between light and dark mode</p>
          </div>
          <button onClick={toggle} className="btn-outline">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-4">Data</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Clear local data</p>
            <p className="text-xs text-slate-500">
              Resets cart, wishlist, profile and all locally stored demo state.
            </p>
          </div>
          <button onClick={clearLocalData} className="btn-outline text-red-500">
            <Trash2 className="w-4 h-4" /> Clear Data
          </button>
        </div>
      </div>
    </div>
  );
}
