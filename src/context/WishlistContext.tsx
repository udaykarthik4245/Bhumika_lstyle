'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WishlistContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const KEY = 'bhumika:wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  return (
    <WishlistContext.Provider
      value={{
        ids,
        has: (id) => ids.includes(id),
        toggle: (id) =>
          setIds((current) =>
            current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
          ),
        remove: (id) => setIds((current) => current.filter((x) => x !== id)),
        clear: () => setIds([]),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
