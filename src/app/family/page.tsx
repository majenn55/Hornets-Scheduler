'use client';

import { useState, useEffect } from 'react';

export default function FamilyPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadFamilies() {
    const res = await fetch('/api/families');
    const data = await res.json();
    setFamilies(data.families || []);
    setLoading(false);
  }

  useEffect(() => { loadFamilies(); }, []);

  async function createFamily(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/families', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: familyName }),
    });
    if (res.ok) {
      setShowCreate(false);
      setFamilyName('');
      loadFamilies();
    }
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!showInvite) return;
    const res = await fetch(`/api/families/${showInvite}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    });
    if (res.ok) {
      setMessage('Invitation sent!');
      setInviteEmail('');
      setShowInvite(null);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Accounts</h1>
          <p className="text-gray-500 text-sm">Create family groups and share access with family members</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">+ Create Family</button>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>
      )}

      {showCreate && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Create Family Account</h3>
          <form onSubmit={createFamily} className="flex gap-3">
            <input
              className="input flex-1"
              placeholder="Family Name (e.g., The Smiths)"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
          </form>
        </div>
      )}

      {families.length === 0 && !showCreate ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">{"\u{1F46A}"}</p>
          <p className="text-gray-500 mb-4">No family accounts yet. Create one to share schedules with your family!</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">Create Family Account</button>
        </div>
      ) : (
        <div className="space-y-4">
          {families.map((family) => (
            <div key={family.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{family.name}</h3>
                  <p className="text-sm text-gray-500">{family.members?.length || 0} members</p>
                </div>
                <button
                  onClick={() => setShowInvite(showInvite === family.id ? null : family.id)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Invite Member
                </button>
              </div>

              {showInvite === family.id && (
                <form onSubmit={sendInvite} className="flex gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="email"
                    className="input flex-1"
                    placeholder="Family member's email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary text-sm">Send Invite</button>
                </form>
              )}

              <div className="flex flex-wrap gap-3">
                {family.members?.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-sm font-medium">
                      {m.user.firstName.charAt(0)}{m.user.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.user.firstName} {m.user.lastName}</p>
                      <p className="text-xs text-gray-500">{m.role.toLowerCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
