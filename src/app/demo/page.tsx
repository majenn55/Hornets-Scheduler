import Link from 'next/link';
import { SportBadge } from '@/components/SportIcon';
import { demoTeams, demoGames, demoNotifications } from '@/lib/demo-data';

export default function DemoDashboard() {
  const upcomingGames = demoGames.filter((g) => g.status === 'SCHEDULED' || g.status === 'IN_PROGRESS');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening across your teams.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction href="/demo/teams" icon={"\u{1F3C6}"} label="My Teams" count={demoTeams.length} />
        <QuickAction href="/demo/games" icon={"\u{1F4C5}"} label="Upcoming Games" count={upcomingGames.length} />
        <QuickAction href="/demo/streams" icon={"\u{1F4F9}"} label="Live Streams" count={1} />
        <QuickAction href="/demo/family" icon={"\u{1F46A}"} label="Family" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Games</h2>
              <Link href="/demo/games" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingGames.map((game) => (
                <Link key={game.id} href="/demo/games" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <SportBadge sport={game.sportType} />
                    <div>
                      <p className="font-medium text-sm">{game.homeTeam.name} vs {game.awayTeam.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(game.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        {game.location && ` - ${game.location}`}
                      </p>
                    </div>
                  </div>
                  {game.status === 'IN_PROGRESS' ? (
                    <span className="badge-red flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>LIVE</span>
                  ) : (
                    <span className="badge-blue">{game.status}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-2">
              {demoNotifications.map((notif) => (
                <div key={notif.id} className={`p-2 text-sm border-l-2 ${notif.read ? 'border-gray-300' : 'border-primary-400'} pl-3`}>
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-gray-500 text-xs">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Teams</h2>
              <Link href="/demo/teams" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
            </div>
            <div className="space-y-2">
              {demoTeams.map((team) => (
                <Link key={team.id} href="/demo/teams" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: team.primaryColor }}>
                    {team.sportType === 'SOCCER' ? '⚽' : team.sportType === 'BASKETBALL' ? '\u{1F3C0}' : '\u{1F94E}'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{team.name}</p>
                    <p className="text-xs text-gray-500">{team.sportType.charAt(0) + team.sportType.slice(1).toLowerCase()} - {team._count.members} members</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label, count }: { href: string; icon: string; label: string; count?: number }) {
  return (
    <Link href={href} className="card hover:shadow-md transition-shadow text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {count !== undefined && <p className="text-2xl font-bold text-primary-600">{count}</p>}
    </Link>
  );
}
