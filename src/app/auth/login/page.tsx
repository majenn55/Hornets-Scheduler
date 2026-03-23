'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in</h2>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
