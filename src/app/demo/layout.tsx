import Link from 'next/link';

const navLinks = [
  { href: '/demo', label: 'Dashboard' },
  { href: '/demo/teams', label: 'Teams' },
  { href: '/demo/leagues', label: 'Leagues' },
  { href: '/demo/games', label: 'Games' },
  { href: '/demo/family', label: 'Family' },
  { href: '/demo/media', label: 'Media' },
  { href: '/demo/streams', label: 'Live' },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-[#C5972C] text-white text-center py-2 px-4 text-sm font-medium">
        You&apos;re viewing a demo with sample data.{' '}
        <Link href="/auth/register" className="underline font-bold hover:text-white/90">
          Create a free account
        </Link>{' '}
        to get started with your own teams!
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/demo" className="flex items-center gap-2">
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
                <span className="badge-yellow ml-1 text-xs">DEMO</span>
              </Link>

              <div className="hidden md:flex ml-8 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-700">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
