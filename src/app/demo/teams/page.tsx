'use client';

import { useState } from 'react';
import { SportBadge } from '@/components/SportIcon';
import { demoTeams } from '@/lib/demo-data';

export default function DemoTeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<typeof demoTeams[0] | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-500 text-sm">Manage your teams and rosters</p>
        </div>
        <button className="btn-primary opacity-75 cursor-not-allowed" title="Sign up to create teams">+ Create Team</button>
      </div>

      {selectedTeam && (
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: selectedTeam.primaryColor }}>
                {selectedTeam.sportType === 'SOCCER' ? '⚽' : selectedTeam.sportType === 'BASKETBALL' ? '\u{1F3C0}' : '\u{1F94E}'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
                <div className="flex items-center gap-2">
                  <SportBadge sport={selectedTeam.sportType} />
                  <span className="text-sm text-gray-500">{selectedTeam.location}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedTeam(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          {selectedTeam.members.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Team Members</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTeam.members.map((m) => (
                  <span key={m.id} className="badge-gray">{m.user.firstName} {m.user.lastName} ({m.role.toLowerCase().replace('_', ' ')})</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Rosters</h3>
            {selectedTeam.rosters.map((roster) => (
              <div key={roster.id} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">{roster.name}</h4>
                  {roster.season && <span className="badge-blue text-xs">{roster.season.name}</span>}
                  <span className="text-xs text-gray-400">{roster.players.length} players</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 text-xs border-b">
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roster.players.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100">
                          <td className="py-2 pr-4 font-mono">{p.jerseyNumber}</td>
                          <td className="py-2 pr-4">{p.firstName} {p.lastName}</td>
                          <td className="py-2 text-gray-500">{p.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoTeams.map((team) => (
          <div key={team.id + team.sportType} onClick={() => setSelectedTeam(team)} className="card cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: team.primaryColor }}>
                {team.sportType === 'SOCCER' ? '⚽' : team.sportType === 'BASKETBALL' ? '\u{1F3C0}' : '\u{1F94E}'}
              </div>
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <SportBadge sport={team.sportType} />
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>{team._count.members} members</span>
              <span>{team._count.rosters} rosters</span>
            </div>
            {team.league && <p className="text-xs text-gray-400 mt-2">League: {team.league.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
