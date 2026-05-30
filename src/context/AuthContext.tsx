'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Address, Order } from '@/lib/types';
import { mockUsers } from '@/lib/mockUsers';
import { generateId } from '@/lib/utils';

interface AuthContextValue {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (data: { name: string; email: string; password: string }) => {
    ok: boolean;
    error?: string;
  };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'userId' | 'placedAt'>) => Order;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = 'bhumika:user';
const USERS_KEY = 'bhumika:users';
const ORDERS_KEY = 'bhumika:orders';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      if (usersRaw) setUsers(JSON.parse(usersRaw));
      const userRaw = localStorage.getItem(USER_KEY);
      if (userRaw) setUser(JSON.parse(userRaw));
      const ordersRaw = localStorage.getItem(ORDERS_KEY);
      if (ordersRaw) setOrders(JSON.parse(ordersRaw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const login: AuthContextValue['login'] = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Invalid email or password' };
    setUser(found);
    return { ok: true };
  };

  const signup: AuthContextValue['signup'] = ({ name, email, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists' };
    }
    const newUser: User = {
      id: generateId('user'),
      name,
      email,
      password,
      role: 'customer',
      addresses: [],
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const resetPassword: AuthContextValue['resetPassword'] = (email, newPassword) => {
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return { ok: false, error: 'No account found with that email' };
    const updated = [...users];
    updated[idx] = { ...updated[idx], password: newPassword };
    setUsers(updated);
    return { ok: true };
  };

  // Mutate helper that updates both `users` list and active `user`.
  const mutateUser = (mutator: (u: User) => User) => {
    if (!user) return;
    const updated = mutator(user);
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const addAddress: AuthContextValue['addAddress'] = (address) => {
    const newAddr: Address = { ...address, id: generateId('addr') };
    mutateUser((u) => {
      const isFirst = u.addresses.length === 0;
      return {
        ...u,
        addresses: [...u.addresses, { ...newAddr, isDefault: isFirst || newAddr.isDefault }],
      };
    });
  };

  const removeAddress: AuthContextValue['removeAddress'] = (id) => {
    mutateUser((u) => ({ ...u, addresses: u.addresses.filter((a) => a.id !== id) }));
  };

  const setDefaultAddress: AuthContextValue['setDefaultAddress'] = (id) => {
    mutateUser((u) => ({
      ...u,
      addresses: u.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    }));
  };

  const placeOrder: AuthContextValue['placeOrder'] = (orderInput) => {
    if (!user) throw new Error('Not authenticated');
    const order: Order = {
      ...orderInput,
      id: generateId('ord'),
      userId: user.id,
      placedAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateProfile: AuthContextValue['updateProfile'] = (data) => {
    mutateUser((u) => ({ ...u, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders: user ? orders.filter((o) => o.userId === user.id) : [],
        login,
        signup,
        logout,
        resetPassword,
        addAddress,
        removeAddress,
        setDefaultAddress,
        placeOrder,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Admin helper — exposes ALL orders for the admin dashboard,
// not just the current user's.
export function useAllOrders(): Order[] {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(ORDERS_KEY);
        if (raw) setOrders(JSON.parse(raw));
      } catch {}
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  return orders;
}
