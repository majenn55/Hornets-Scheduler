import { SportBadge } from '@/components/SportIcon';
import { demoLeagues } from '@/lib/demo-data';

export default function DemoLeaguesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leagues</h1>
          <p className="text-gray-500 text-sm">Organize teams into competitive leagues</p>
        </div>
        <button className="btn-primary opacity-75 cursor-not-allowed" title="Sign up to create leagues">+ Create League</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoLeagues.map((league) => (
          <div key={league.id} className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">{league.name}</h3>
            <SportBadge sport={league.sportType} />
            {league.description && <p className="text-sm text-gray-500 mt-2">{league.description}</p>}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-lg font-bold text-primary-600">{league._count.teams}</p>
                <p className="text-xs text-gray-500">Teams</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-lg font-bold text-primary-600">{league._count.members}</p>
                <p className="text-xs text-gray-500">Members</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-lg font-bold text-primary-600">{league._count.seasons}</p>
                <p className="text-xs text-gray-500">Seasons</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{league.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
