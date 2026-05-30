'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/account';

  const [email, setEmail] = useState('demo@bhumikastyle.com');
  const [password, setPassword] = useState('demo123');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) {
      toast.show('Welcome back!');
      router.push(next);
    } else {
      toast.show(res.error || 'Login failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-6">Login to continue your shopping journey.</p>
      <form onSubmit={submit} className="space-y-4 card p-6">
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Login
        </button>
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-brand-500 hover:underline">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-brand-500 hover:underline">
            Create account
          </Link>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3">
          <p>Demo accounts:</p>
          <p>Customer: demo@bhumikastyle.com / demo123</p>
          <p>Admin: admin@bhumikastyle.com / admin123</p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
