'use client';

import { useState, useEffect } from 'react';
import { SportBadge } from '@/components/SportIcon';

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  async function loadGames() {
    const params = filter === 'upcoming' ? '?upcoming=true' : filter !== 'all' ? `?status=${filter}` : '';
    const res = await fetch(`/api/games${params}`);
    const data = await res.json();
    setGames(data.games || []);
    setLoading(false);
  }

  useEffect(() => { loadGames(); }, [filter]);

  async function loadGameDetails(id: string) {
    const res = await fetch(`/api/games/${id}`);
    const data = await res.json();
    setSelectedGame(data.game);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'SCHEDULED': return 'badge-blue';
      case 'IN_PROGRESS': return 'badge-green';
      case 'COMPLETED': return 'badge-gray';
      case 'POSTPONED': return 'badge-yellow';
      case 'CANCELLED': return 'badge-red';
      default: return 'badge-gray';
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Games</h1>
          <p className="text-gray-500 text-sm">View and manage game schedules</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'upcoming', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All Games' : f === 'upcoming' ? 'Upcoming' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {selectedGame && (
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SportBadge sport={selectedGame.sportType} />
                <span className={getStatusColor(selectedGame.status)}>{selectedGame.status.replace('_', ' ')}</span>
              </div>
              <h2 className="text-xl font-bold">
                {selectedGame.homeTeam.name} vs {selectedGame.awayTeam.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {new Date(selectedGame.scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit',
                })}
              </p>
              {selectedGame.location && <p className="text-gray-500 text-sm">{selectedGame.location}</p>}
            </div>
            <button onClick={() => setSelectedGame(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          {(selectedGame.homeScore !== null || selectedGame.awayScore !== null) && (
            <div className="bg-gray-50 rounded-xl p-6 text-center mb-4">
              <div className="flex items-center justify-center gap-8">
                <div>
                  <p className="text-sm font-medium text-gray-500">{selectedGame.homeTeam.name}</p>
                  <p className="text-4xl font-bold">{selectedGame.homeScore ?? 0}</p>
                </div>
                <span className="text-gray-400 text-xl">vs</span>
                <div>
                  <p className="text-sm font-medium text-gray-500">{selectedGame.awayTeam.name}</p>
                  <p className="text-4xl font-bold">{selectedGame.awayScore ?? 0}</p>
                </div>
              </div>
            </div>
          )}

          {selectedGame.stats?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Player Stats</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs border-b">
                      <th className="py-2 pr-4">Player</th>
                      <th className="py-2">Stats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGame.stats.map((stat: any) => (
                      <tr key={stat.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4">
                          #{stat.rosterPlayer.jerseyNumber} {stat.rosterPlayer.firstName} {stat.rosterPlayer.lastName}
                        </td>
                        <td className="py-2 text-gray-600">
                          {Object.entries(stat.statData as Record<string, number>)
                            .filter(([, v]) => v > 0)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ') || 'No stats recorded'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedGame.streams?.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-700 font-medium text-sm">Live Stream Active</span>
            </div>
          )}
        </div>
      )}

      {games.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No games found. Schedule games from a league&apos;s season.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => loadGameDetails(game.id)}
              className="card cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SportBadge sport={game.sportType} />
                  <div>
                    <p className="font-semibold">
                      {game.homeTeam.name} vs {game.awayTeam.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(game.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                        hour: 'numeric', minute: '2-digit',
                      })}
                      {game.location && ` \u2022 ${game.location}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {game.homeScore !== null && (
                    <span className="font-bold text-lg">
                      {game.homeScore} - {game.awayScore}
                    </span>
                  )}
                  <span className={getStatusColor(game.status)}>{game.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
