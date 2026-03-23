'use client';

import { useState, useEffect } from 'react';
import { SportBadge } from '@/components/SportIcon';

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    sportType: 'SOCCER',
    description: '',
    location: '',
  });

  async function loadLeagues() {
    const res = await fetch('/api/leagues');
    const data = await res.json();
    setLeagues(data.leagues || []);
    setLoading(false);
  }

  useEffect(() => { loadLeagues(); }, []);

  async function createLeague(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/leagues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ name: '', sportType: 'SOCCER', description: '', location: '' });
      loadLeagues();
    }
  }

  async function loadLeagueDetails(id: string) {
    const res = await fetch(`/api/leagues/${id}`);
    const data = await res.json();
    setSelectedLeague(data.league);
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leagues</h1>
          <p className="text-gray-500 text-sm">Organize teams into competitive leagues</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">+ Create League</button>
      </div>

      {showCreate && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New League</h3>
          <form onSubmit={createLeague} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">League Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Sport</label>
              <select className="input" value={form.sportType} onChange={(e) => setForm({ ...form, sportType: e.target.value })}>
                <option value="SOCCER">Soccer</option>
                <option value="SOFTBALL">Softball</option>
                <option value="BASKETBALL">Basketball</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">Create League</button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {selectedLeague && (
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{selectedLeague.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <SportBadge sport={selectedLeague.sportType} />
                {selectedLeague.location && <span className="text-sm text-gray-500">{selectedLeague.location}</span>}
              </div>
            </div>
            <button onClick={() => setSelectedLeague(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          {selectedLeague.description && <p className="text-gray-600 mb-4">{selectedLeague.description}</p>}

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">{selectedLeague._count?.teams || 0}</p>
              <p className="text-xs text-gray-500">Teams</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">{selectedLeague._count?.members || 0}</p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">{selectedLeague._count?.seasons || 0}</p>
              <p className="text-xs text-gray-500">Seasons</p>
            </div>
          </div>

          {selectedLeague.teams?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Teams</h3>
              <div className="flex flex-wrap gap-2">
                {selectedLeague.teams.map((t: any) => (
                  <span key={t.id} className="badge-green">{t.name} ({t._count?.members || 0})</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {leagues.length === 0 && !showCreate ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No leagues yet. Create one to organize your teams!</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">Create League</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leagues.map((league) => (
            <div key={league.id} onClick={() => loadLeagueDetails(league.id)} className="card cursor-pointer hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-1">{league.name}</h3>
              <SportBadge sport={league.sportType} />
              <div className="flex gap-4 text-sm text-gray-500 mt-3">
                <span>{league._count?.teams || 0} teams</span>
                <span>{league._count?.seasons || 0} seasons</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
