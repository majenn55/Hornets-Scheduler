import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a5e1a] via-[#155215] to-[#0a2d0a]">
      <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Hornet Logo */}
          <div className="w-12 h-12 bg-[#C5972C] rounded-full flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
              <ellipse cx="20" cy="18" rx="10" ry="12" fill="#0a2d0a" />
              <ellipse cx="20" cy="18" rx="10" ry="12" fill="url(#hornet-stripe)" />
              <rect x="14" y="10" width="12" height="3" rx="1" fill="#C5972C" />
              <rect x="14" y="16" width="12" height="3" rx="1" fill="#C5972C" />
              <rect x="14" y="22" width="12" height="3" rx="1" fill="#C5972C" />
              <circle cx="16" cy="12" r="1.5" fill="white" />
              <circle cx="24" cy="12" r="1.5" fill="white" />
              <path d="M15 7 Q12 2 10 4" stroke="#C5972C" strokeWidth="1.5" fill="none" />
              <path d="M25 7 Q28 2 30 4" stroke="#C5972C" strokeWidth="1.5" fill="none" />
              <path d="M20 30 L20 36" stroke="#0a2d0a" strokeWidth="1.5" />
              <path d="M8 16 Q3 14 4 18" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M32 16 Q37 14 36 18" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-xl block leading-tight">Greenhill Hornets</span>
            <span className="text-[#C5972C] text-xs font-medium tracking-wider">SCHEDULER</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-white/80 hover:text-white px-4 py-2 text-sm font-medium">
            Sign In
          </Link>
          <Link href="/auth/register" className="bg-[#C5972C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e4b53a] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          {/* Large Hornet Emblem */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-[#C5972C]/20 rounded-full flex items-center justify-center border-2 border-[#C5972C]/40">
              <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
                <ellipse cx="20" cy="18" rx="10" ry="12" fill="#0a2d0a" />
                <rect x="14" y="10" width="12" height="3" rx="1" fill="#C5972C" />
                <rect x="14" y="16" width="12" height="3" rx="1" fill="#C5972C" />
                <rect x="14" y="22" width="12" height="3" rx="1" fill="#C5972C" />
                <circle cx="16" cy="12" r="1.5" fill="white" />
                <circle cx="24" cy="12" r="1.5" fill="white" />
                <path d="M15 7 Q12 2 10 4" stroke="#C5972C" strokeWidth="1.5" fill="none" />
                <path d="M25 7 Q28 2 30 4" stroke="#C5972C" strokeWidth="1.5" fill="none" />
                <path d="M20 30 L20 36" stroke="#C5972C" strokeWidth="1.5" />
                <path d="M8 16 Q3 14 4 18" stroke="white" strokeWidth="0.8" fill="none" opacity="0.3" />
                <path d="M32 16 Q37 14 36 18" stroke="white" strokeWidth="0.8" fill="none" opacity="0.3" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Greenhill Hornets
            <br />
            <span className="text-[#C5972C]">Sports Scheduler</span>
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Manage teams, schedule games, track stats, capture moments, and stream live -
            all in one place for soccer, softball, and basketball.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register" className="bg-[#C5972C] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#e4b53a] transition-colors shadow-lg">
              Start Free
            </Link>
            <Link href="/auth/login" className="border-2 border-[#C5972C]/60 text-[#C5972C] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#C5972C]/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={"\u{1F3C6}"}
            title="Teams & Leagues"
            description="Create teams, build rosters with player details, and organize into leagues across soccer, softball, and basketball."
          />
          <FeatureCard
            icon={"\u{1F4C5}"}
            title="Smart Scheduling"
            description="Schedule games and full seasons with automated scheduling. Never miss a game with reminders and notifications."
          />
          <FeatureCard
            icon={"\u{1F4CA}"}
            title="Sport-Specific Stats"
            description="Track goals, assists, batting averages, rebounds - every stat that matters for each sport, for each player."
          />
          <FeatureCard
            icon={"\u{1F46A}"}
            title="Family Accounts"
            description="Create family accounts and share access with family members. Keep everyone in the loop on schedules and updates."
          />
          <FeatureCard
            icon={"\u{1F4F7}"}
            title="Photos & Videos"
            description="Capture game-day moments with in-app photo and video features. Build a media library for your team."
          />
          <FeatureCard
            icon={"\u{1F4F9}"}
            title="Live Streaming"
            description="Stream games live so family, fans, and scouts can watch from anywhere. Real-time viewer engagement."
          />
        </div>

        <div className="mt-24 text-center">
          <div className="flex justify-center gap-8 text-6xl">
            <span className="opacity-60">{"\u26BD"}</span>
            <span className="opacity-60">{"\u{1F94E}"}</span>
            <span className="opacity-60">{"\u{1F3C0}"}</span>
          </div>
          <p className="text-[#C5972C]/60 mt-4 text-sm font-medium tracking-wider">
            GREENHILL SCHOOL &bull; ADDISON, TEXAS &bull; GO HORNETS!
          </p>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-[#C5972C]/20 hover:border-[#C5972C]/40 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
}
