import { demoStreams } from '@/lib/demo-data';

export default function DemoStreamsPage() {
  const liveStreams = demoStreams.filter((s) => s.status === 'LIVE');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Streams</h1>
        <p className="text-gray-500 text-sm">Watch and stream live games</p>
      </div>

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
                      {stream.game.homeTeam.name} vs {stream.game.awayTeam.name}
                    </p>
                  </div>
                  <span className="badge-red flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>LIVE
                  </span>
                </div>
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-3">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <p className="text-sm opacity-70 mt-2">Live Stream Player</p>
                    <p className="text-xs opacity-40 mt-1">Sign up to watch live</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Started by {stream.starter.firstName} {stream.starter.lastName}</span>
                  <span>{stream.viewerCount} viewers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">All Streams</h2>
      <div className="space-y-3">
        {demoStreams.map((stream) => (
          <div key={stream.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{stream.title}</h3>
                  {stream.status === 'LIVE' ? (
                    <span className="badge-red flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>LIVE</span>
                  ) : (
                    <span className="badge-gray">Ended</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {stream.game.homeTeam.name} vs {stream.game.awayTeam.name}
                  {' • '}
                  {new Date(stream.game.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{stream.starter.firstName} {stream.starter.lastName}</p>
                <p>{stream.viewerCount} viewers</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
