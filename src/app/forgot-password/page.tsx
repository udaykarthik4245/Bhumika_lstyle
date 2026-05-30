'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.show('Password must be at least 6 characters', 'error');
      return;
    }
    const res = resetPassword(email, newPassword);
    if (res.ok) {
      toast.show('Password reset successfully');
      router.push('/login');
    } else {
      toast.show(res.error || 'Reset failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Reset Password</h1>
      <p className="text-sm text-slate-500 mb-6">
        Enter your email and choose a new password. (Demo only — no email sent.)
      </p>
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
          <label className="text-sm font-medium block mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Reset Password
        </button>
        <p className="text-sm text-center">
          <Link href="/login" className="text-brand-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
