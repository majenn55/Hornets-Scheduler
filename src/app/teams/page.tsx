'use client';

import { useState, useEffect } from 'react';
import { SportBadge } from '@/components/SportIcon';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    sportType: 'SOCCER',
    primaryColor: '#16a34a',
    secondaryColor: '#ffffff',
    location: '',
  });

  async function loadTeams() {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data.teams || []);
    setLoading(false);
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function createTeam(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ name: '', sportType: 'SOCCER', primaryColor: '#16a34a', secondaryColor: '#ffffff', location: '' });
      loadTeams();
    }
  }

  async function loadTeamDetails(teamId: string) {
    const res = await fetch(`/api/teams/${teamId}`);
    const data = await res.json();
    setSelectedTeam(data.team);
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-500 text-sm">Manage your teams and rosters</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          + Create Team
        </button>
      </div>

      {showCreate && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
          <form onSubmit={createTeam} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Team Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Sport</label>
              <select
                className="input"
                value={form.sportType}
                onChange={(e) => setForm({ ...form, sportType: e.target.value })}
              >
                <option value="SOCCER">Soccer</option>
                <option value="SOFTBALL">Softball</option>
                <option value="BASKETBALL">Basketball</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="label">Primary Color</label>
                <input
                  type="color"
                  className="w-10 h-10 rounded cursor-pointer"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Secondary Color</label>
                <input
                  type="color"
                  className="w-10 h-10 rounded cursor-pointer"
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">Create Team</button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {selectedTeam && (
        <TeamDetail team={selectedTeam} onClose={() => setSelectedTeam(null)} onRefresh={loadTeams} />
      )}

      {teams.length === 0 && !showCreate ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No teams yet. Create your first team to get started!</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => loadTeamDetails(team.id)}
              className="card cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: team.primaryColor || '#16a34a' }}
                >
                  {team.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <SportBadge sport={team.sportType} />
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{team._count?.members || 0} members</span>
                <span>{team._count?.rosters || 0} rosters</span>
              </div>
              {team.league && (
                <p className="text-xs text-gray-400 mt-2">League: {team.league.name}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamDetail({ team, onClose, onRefresh }: { team: any; onClose: () => void; onRefresh: () => void }) {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState<string>('');
  const [playerForm, setPlayerForm] = useState({
    firstName: '',
    lastName: '',
    jerseyNumber: '',
    position: '',
  });

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRoster) return;
    const res = await fetch(`/api/rosters/${selectedRoster}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerForm),
    });
    if (res.ok) {
      setShowAddPlayer(false);
      setPlayerForm({ firstName: '', lastName: '', jerseyNumber: '', position: '' });
      onRefresh();
    }
  }

  async function createRoster() {
    const name = prompt('Roster name:');
    if (!name) return;
    await fetch('/api/rosters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: team.id, name }),
    });
    onRefresh();
  }

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: team.primaryColor || '#16a34a' }}
          >
            {team.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{team.name}</h2>
            <div className="flex items-center gap-2">
              <SportBadge sport={team.sportType} />
              {team.location && <span className="text-sm text-gray-500">{team.location}</span>}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      {/* Members */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Team Members</h3>
        <div className="flex flex-wrap gap-2">
          {team.members?.map((m: any) => (
            <span key={m.id} className="badge-gray">
              {m.user.firstName} {m.user.lastName} ({m.role.toLowerCase()})
            </span>
          ))}
        </div>
      </div>

      {/* Rosters */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Rosters</h3>
          <div className="flex gap-2">
            <button onClick={createRoster} className="text-sm text-primary-600 hover:text-primary-700">
              + New Roster
            </button>
            {team.rosters?.length > 0 && (
              <button onClick={() => setShowAddPlayer(!showAddPlayer)} className="text-sm text-primary-600 hover:text-primary-700">
                + Add Player
              </button>
            )}
          </div>
        </div>

        {showAddPlayer && (
          <form onSubmit={addPlayer} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
            <select
              className="input"
              value={selectedRoster}
              onChange={(e) => setSelectedRoster(e.target.value)}
              required
            >
              <option value="">Select Roster</option>
              {team.rosters?.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="input"
                placeholder="First Name"
                value={playerForm.firstName}
                onChange={(e) => setPlayerForm({ ...playerForm, firstName: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Last Name"
                value={playerForm.lastName}
                onChange={(e) => setPlayerForm({ ...playerForm, lastName: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Jersey #"
                value={playerForm.jerseyNumber}
                onChange={(e) => setPlayerForm({ ...playerForm, jerseyNumber: e.target.value })}
              />
              <input
                className="input"
                placeholder="Position"
                value={playerForm.position}
                onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Add Player</button>
              <button type="button" onClick={() => setShowAddPlayer(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}

        {team.rosters?.length === 0 ? (
          <p className="text-gray-500 text-sm">No rosters yet.</p>
        ) : (
          team.rosters?.map((roster: any) => (
            <div key={roster.id} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-medium">{roster.name}</h4>
                {roster.season && <span className="badge-blue text-xs">{roster.season.name}</span>}
                <span className="text-xs text-gray-400">{roster.players?.length || 0} players</span>
              </div>
              {roster.players?.length > 0 && (
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
                      {roster.players.map((p: any) => (
                        <tr key={p.id} className="border-b border-gray-100">
                          <td className="py-2 pr-4 font-mono">{p.jerseyNumber || '-'}</td>
                          <td className="py-2 pr-4">{p.firstName} {p.lastName}</td>
                          <td className="py-2 text-gray-500">{p.position || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
