import { demoFamilies } from '@/lib/demo-data';

export default function DemoFamilyPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Accounts</h1>
          <p className="text-gray-500 text-sm">Create family groups and share access with family members</p>
        </div>
        <button className="btn-primary opacity-75 cursor-not-allowed" title="Sign up to create families">+ Create Family</button>
      </div>

      <div className="space-y-4">
        {demoFamilies.map((family) => (
          <div key={family.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{family.name}</h3>
                <p className="text-sm text-gray-500">{family.members.length} members</p>
              </div>
              <button className="text-sm text-primary-600 opacity-75 cursor-not-allowed">+ Invite Member</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {family.members.map((m) => (
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

      <div className="card mt-6 bg-primary-50 border-primary-200">
        <h3 className="font-semibold text-primary-800 mb-2">How Family Accounts Work</h3>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>&bull; Create a family group and invite members by email</li>
          <li>&bull; All members can view shared schedules, stats, and media</li>
          <li>&bull; Parents can manage multiple children across different teams</li>
          <li>&bull; Get notified about games, scores, and live streams together</li>
        </ul>
      </div>
    </div>
  );
}
