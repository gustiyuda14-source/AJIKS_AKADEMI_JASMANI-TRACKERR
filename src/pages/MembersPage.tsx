import { useState, useEffect } from 'react';

interface Member {
  id: number;
  name: string;
  gender: string;
  weightCurrent: number;
  status: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/members`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMembers(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold uppercase">
          <span className="text-fire">Members</span> Management
        </h2>
        <button className="btn btn-fire">+ Add Member</button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-2">Loading members...</div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-text-2 font-bold">#</th>
                <th className="text-left p-4 text-text-2 font-bold">Name</th>
                <th className="text-left p-4 text-text-2 font-bold">Gender</th>
                <th className="text-left p-4 text-text-2 font-bold">Weight</th>
                <th className="text-left p-4 text-text-2 font-bold">Status</th>
                <th className="text-left p-4 text-text-2 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, idx) => (
                <tr
                  key={member.id}
                  className="border-b border-border hover:bg-surface-3"
                >
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4 font-bold">{member.name}</td>
                  <td className="p-4">
                    {member.gender === 'L' ? '👨 Male' : '👩 Female'}
                  </td>
                  <td className="p-4">{member.weightCurrent} kg</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        member.status === 'active'
                          ? 'bg-green-900 text-green'
                          : 'bg-gray-900 text-gray-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button className="text-gold hover:text-gold-dim text-sm font-bold">
                      Edit
                    </button>
                    <button className="text-fire hover:text-fire-light text-sm font-bold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <div className="text-center py-12 text-text-2">
              No members yet. Add one to get started!
            </div>
          )}
        </div>
      )}
    </main>
  );
}
