'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.show('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirm) {
      toast.show('Passwords do not match', 'error');
      return;
    }
    const res = signup({ name, email, password });
    if (res.ok) {
      toast.show('Account created!');
      router.push('/account');
    } else {
      toast.show(res.error || 'Signup failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 mb-6">
        Join Bhumika Style Studio to track orders and save favorites.
      </p>
      <form onSubmit={submit} className="space-y-4 card p-6">
        <div>
          <label className="text-sm font-medium block mb-1">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Confirm Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Sign Up
        </button>
        <p className="text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
