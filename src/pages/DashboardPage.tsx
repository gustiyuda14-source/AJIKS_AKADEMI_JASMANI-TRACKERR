import { useState, useEffect } from 'react';

interface Member {
  id: number;
  name: string;
  gender: string;
  weightCurrent: number;
  heightCm: number;
}

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
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
          const fetchedMembers = data.data || [];
          setMembers(fetchedMembers);
          if (fetchedMembers.length > 0) {
            setSelectedMember(fetchedMembers[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-2">Loading...</div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold uppercase mb-6">
        <span className="text-fire">Dashboard</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className={`p-3 rounded text-center transition ${
              selectedMember?.id === member.id
                ? 'bg-fire text-white'
                : 'bg-surface-2 text-text-2 hover:border-fire border border-border'
            }`}
          >
            <div className="font-bold">{member.name}</div>
            <div className="text-xs">{member.gender === 'L' ? '👨' : '👩'}</div>
          </button>
        ))}
      </div>

      {selectedMember && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4 text-fire">Member Profile</h3>
            <div className="space-y-3">
              <div>
                <span className="text-text-3">Name:</span>{' '}
                <span className="font-bold">{selectedMember.name}</span>
              </div>
              <div>
                <span className="text-text-3">Height:</span>{' '}
                <span className="font-bold">{selectedMember.heightCm} cm</span>
              </div>
              <div>
                <span className="text-text-3">Current Weight:</span>{' '}
                <span className="font-bold">{selectedMember.weightCurrent} kg</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4 text-gold">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-fire w-full">Add Training Data</button>
              <button className="btn btn-gold w-full">View Progress</button>
              <button className="btn btn-ghost w-full">Export Report</button>
            </div>
          </div>
        </div>
      )}

      {members.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-2 mb-4">No members found</p>
          <button className="btn btn-fire">Add First Member</button>
        </div>
      )}
    </main>
  );
}
