'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetch('/api/notifications?unread=true')
        .then((r) => r.json())
        .then((d) => setUnreadCount(d.unreadCount || 0))
        .catch(() => {});
    }
  }, [session]);

  if (!session) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a5e1a] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                  <ellipse cx="20" cy="18" rx="10" ry="12" fill="#0a2d0a" />
                  <rect x="14" y="10" width="12" height="3" rx="1" fill="#C5972C" />
                  <rect x="14" y="16" width="12" height="3" rx="1" fill="#C5972C" />
                  <rect x="14" y="22" width="12" height="3" rx="1" fill="#C5972C" />
                  <circle cx="16" cy="12" r="1.5" fill="white" />
                  <circle cx="24" cy="12" r="1.5" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-lg text-gray-900 hidden sm:block">
                Greenhill Hornets
              </span>
            </Link>

            <div className="hidden md:flex ml-8 gap-1">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/teams">Teams</NavLink>
              <NavLink href="/leagues">Leagues</NavLink>
              <NavLink href="/games">Games</NavLink>
              <NavLink href="/family">Family</NavLink>
              <NavLink href="/media">Media</NavLink>
              <NavLink href="/streams">Live</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="relative p-2 text-gray-500 hover:text-gray-700"
              title="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            <MobileNavLink href="/teams" onClick={() => setMobileMenuOpen(false)}>Teams</MobileNavLink>
            <MobileNavLink href="/leagues" onClick={() => setMobileMenuOpen(false)}>Leagues</MobileNavLink>
            <MobileNavLink href="/games" onClick={() => setMobileMenuOpen(false)}>Games</MobileNavLink>
            <MobileNavLink href="/family" onClick={() => setMobileMenuOpen(false)}>Family</MobileNavLink>
            <MobileNavLink href="/media" onClick={() => setMobileMenuOpen(false)}>Media</MobileNavLink>
            <MobileNavLink href="/streams" onClick={() => setMobileMenuOpen(false)}>Live Streams</MobileNavLink>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
    >
      {children}
    </Link>
  );
}
