'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || 'Registration failed');
      return;
    }

    // Auto-login after registration
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Account created. Please sign in.');
      router.push('/auth/login');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1a5e1a] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                <ellipse cx="20" cy="18" rx="10" ry="12" fill="#0a2d0a" />
                <rect x="14" y="10" width="12" height="3" rx="1" fill="#C5972C" />
                <rect x="14" y="16" width="12" height="3" rx="1" fill="#C5972C" />
                <rect x="14" y="22" width="12" height="3" rx="1" fill="#C5972C" />
                <circle cx="16" cy="12" r="1.5" fill="white" />
                <circle cx="24" cy="12" r="1.5" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">Greenhill Hornets</span>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create account</h2>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Phone (optional)</label>
              <input
                type="tel"
                className="input"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                required
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Min 8 characters, uppercase, lowercase, number, and special character
              </p>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className="input"
                value={form.confirmPassword}
                onChange={(e) => updateForm('confirmPassword', e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
