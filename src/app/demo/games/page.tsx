'use client';

import { useState } from 'react';
import { SportBadge } from '@/components/SportIcon';
import { demoGames } from '@/lib/demo-data';

export default function DemoGamesPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? demoGames
    : filter === 'upcoming'
    ? demoGames.filter((g) => g.status === 'SCHEDULED')
    : demoGames.filter((g) => g.status === filter);

  function getStatusColor(status: string) {
    switch (status) {
      case 'SCHEDULED': return 'badge-blue';
      case 'IN_PROGRESS': return 'badge-green';
      case 'COMPLETED': return 'badge-gray';
      default: return 'badge-gray';
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Games</h1>
        <p className="text-gray-500 text-sm">View and manage game schedules</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'upcoming', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f === 'all' ? 'All Games' : f === 'upcoming' ? 'Upcoming' : f === 'IN_PROGRESS' ? 'Live Now' : 'Completed'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((game) => (
          <div key={game.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SportBadge sport={game.sportType} />
                <div>
                  <p className="font-semibold">{game.homeTeam.name} vs {game.awayTeam.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(game.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    {game.location && ` • ${game.location}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {game.homeScore !== null && (
                  <span className="font-bold text-lg">{game.homeScore} - {game.awayScore}</span>
                )}
                {game.status === 'IN_PROGRESS' ? (
                  <span className="badge-red flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>LIVE</span>
                ) : (
                  <span className={getStatusColor(game.status)}>{game.status}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
