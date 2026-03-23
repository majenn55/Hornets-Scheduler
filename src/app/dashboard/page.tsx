'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SportBadge } from '@/components/SportIcon';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/teams').then((r) => r.json()),
      fetch('/api/games?upcoming=true').then((r) => r.json()),
      fetch('/api/notifications?unread=true').then((r) => r.json()),
    ])
      .then(([teamsData, gamesData, notifData]) => {
        setTeams(teamsData.teams || []);
        setGames(gamesData.games || []);
        setNotifications(notifData.notifications || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening across your teams.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction href="/teams" icon={"\u{1F3C6}"} label="My Teams" count={teams.length} />
        <QuickAction href="/games" icon={"\u{1F4C5}"} label="Upcoming Games" count={games.length} />
        <QuickAction href="/streams" icon={"\u{1F4F9}"} label="Live Streams" />
        <QuickAction href="/family" icon={"\u{1F46A}"} label="Family" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Games */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Games</h2>
              <Link href="/games" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {games.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No upcoming games scheduled.</p>
            ) : (
              <div className="space-y-3">
                {games.slice(0, 5).map((game: any) => (
                  <Link
                    key={game.id}
                    href={`/games?id=${game.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <SportBadge sport={game.sportType} />
                      <div>
                        <p className="font-medium text-sm">
                          {game.homeTeam.name} vs {game.awayTeam.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(game.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                          {game.location && ` - ${game.location}`}
                        </p>
                      </div>
                    </div>
                    <span className="badge-blue">{game.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Teams */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">All caught up!</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notif: any) => (
                  <div key={notif.id} className="p-2 text-sm border-l-2 border-primary-400 pl-3">
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-gray-500 text-xs">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Teams</h2>
              <Link href="/teams" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {teams.length === 0 ? (
              <div>
                <p className="text-gray-500 text-sm mb-3">No teams yet.</p>
                <Link href="/teams" className="btn-primary text-sm">
                  Create a Team
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {teams.slice(0, 5).map((team: any) => (
                  <Link
                    key={team.id}
                    href={`/teams?id=${team.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: team.primaryColor || '#16a34a' }}
                    >
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{team.name}</p>
                      <p className="text-xs text-gray-500">
                        {team._count?.members || 0} members
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
      {count !== undefined && (
        <p className="text-2xl font-bold text-primary-600">{count}</p>
      )}
    </Link>
  );
}
