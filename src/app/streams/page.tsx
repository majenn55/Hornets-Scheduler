'use client';

import { useState, useEffect } from 'react';

export default function StreamsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadStreams() {
    const [allRes, liveRes] = await Promise.all([
      fetch('/api/streams'),
      fetch('/api/streams?live=true'),
    ]);
    const [allData, liveData] = await Promise.all([allRes.json(), liveRes.json()]);
    setStreams(allData.streams || []);
    setLiveStreams(liveData.streams || []);
    setLoading(false);
  }

  useEffect(() => { loadStreams(); }, []);

  function getStatusBadge(status: string) {
    switch (status) {
      case 'LIVE': return <span className="badge-red flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>LIVE</span>;
      case 'ENDED': return <span className="badge-gray">Ended</span>;
      case 'PENDING': return <span className="badge-yellow">Pending</span>;
      default: return <span className="badge-gray">{status}</span>;
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Streams</h1>
        <p className="text-gray-500 text-sm">Watch and stream live games</p>
      </div>

      {/* Live Now Section */}
      {liveStreams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Live Now
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="card border-red-200 bg-red-50/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{stream.title}</h3>
                    <p className="text-sm text-gray-600">
                      {stream.game?.homeTeam?.name} vs {stream.game?.awayTeam?.name}
                    </p>
                  </div>
                  {getStatusBadge(stream.status)}
                </div>
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-3">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <p className="text-sm opacity-70">Live Stream Player</p>
                    <p className="text-xs opacity-50 mt-1">HLS URL: {stream.hlsUrl}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Started by {stream.starter?.firstName} {stream.starter?.lastName}</span>
                  <span>{stream.viewerCount} viewers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Streams */}
      <h2 className="text-lg font-semibold mb-3">All Streams</h2>
      {streams.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">{"\u{1F4F9}"}</p>
          <p className="text-gray-500 mb-2">No streams yet.</p>
          <p className="text-gray-400 text-sm">Start a live stream from a game page to broadcast to your team and fans.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {streams.map((stream) => (
            <div key={stream.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{stream.title}</h3>
                    {getStatusBadge(stream.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {stream.game?.homeTeam?.name} vs {stream.game?.awayTeam?.name}
                    {' \u2022 '}
                    {new Date(stream.game?.scheduledAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{stream.starter?.firstName} {stream.starter?.lastName}</p>
                  {stream.viewerCount > 0 && <p>{stream.viewerCount} viewers</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
