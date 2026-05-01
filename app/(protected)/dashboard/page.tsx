import { createClient } from '@/lib/supabase/server';
import { getGrade, getGradeColor } from '@/lib/scoring';
import { Users, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export const metadata = { title: 'Dashboard — AJIKS Tracker' };

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: members }, { data: logs }] = await Promise.all([
    supabase.from('members').select('*'),
    supabase
      .from('exercise_logs')
      .select('score, grade, created_at, members(category)')
      .order('created_at', { ascending: false })
      .limit(100),
  ]);

  const totalMembers = members?.length ?? 0;
  const ipdnMembers   = members?.filter((m: {category: string}) => m.category === 'ipdn').length ?? 0;
  const polriMembers  = members?.filter((m: {category: string}) => m.category === 'tni-polri').length ?? 0;
  const avgScore      = logs?.length
    ? Math.round(logs.reduce((s: number, l: {score: number}) => s + (l.score ?? 0), 0) / logs.length)
    : 0;
  const passCount = logs?.filter((l: {grade: string}) => l.grade && l.grade !== 'TMS' && l.grade !== 'D').length ?? 0;
  const tmsCount  = logs?.filter((l: {grade: string}) => l.grade === 'TMS').length ?? 0;

  const recentLogs = logs?.slice(0, 10) ?? [];

  const statCards = [
    { label: 'Total Anggota', value: totalMembers, sub: `IPDN: ${ipdnMembers} | TNI/Polri: ${polriMembers}`, icon: Users, color: 'text-blue-400' },
    { label: 'Rata-rata Skor', value: avgScore, sub: 'dari semua sesi latihan', icon: TrendingUp, color: 'text-gold' },
    { label: 'Sesi Lulus', value: passCount, sub: 'grade A / B / C', icon: Award, color: 'text-green-400' },
    { label: 'Sesi TMS', value: tmsCount, sub: 'Tidak Memenuhi Syarat', icon: AlertTriangle, color: 'text-red-400' },
  ];

  const gradeDistribution = ['A', 'B', 'C', 'D', 'TMS'].map(grade => ({
    grade,
    count: logs?.filter((l: {grade: string}) => l.grade === grade).length ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-title">Dashboard Utama</h1>
        <p className="section-sub">Statistik global seluruh anggota dan sesi latihan</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="card flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-dark-muted">{card.label}</p>
              <card.icon className={clsx('w-4 h-4', card.color)} />
            </div>
            <p className="text-3xl font-bold text-dark-text">{card.value}</p>
            <p className="text-xs text-dark-muted">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      <div className="card">
        <h2 className="text-sm font-semibold text-dark-text mb-4">Distribusi Grade</h2>
        <div className="flex items-end gap-3 h-24">
          {gradeDistribution.map(({ grade, count }) => {
            const maxCount = Math.max(...gradeDistribution.map(g => g.count), 1);
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={grade} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-dark-muted">{count}</span>
                <div
                  className={clsx('w-full rounded-t-sm transition-all', {
                    'bg-green-500':  grade === 'A',
                    'bg-yellow-500': grade === 'B',
                    'bg-orange-500': grade === 'C',
                    'bg-red-600':    grade === 'D' || grade === 'TMS',
                  })}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
                <span className="text-xs font-bold text-dark-muted">{grade}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-sm font-semibold text-dark-text mb-4">Aktivitas Terbaru</h2>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-dark-muted text-center py-8">Belum ada data latihan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="table-head text-left">Tanggal</th>
                  <th className="table-head text-left">Skor</th>
                  <th className="table-head text-left">Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log: {score: number; grade: string; created_at: string}, i: number) => {
                  const grade = (log.grade ?? 'D') as Parameters<typeof getGradeColor>[0];
                  return (
                    <tr key={i} className="hover:bg-dark-border/20 transition-colors">
                      <td className="table-cell">
                        {new Date(log.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="table-cell font-mono font-semibold">{log.score ?? '—'}</td>
                      <td className="table-cell">
                        <span className={clsx('badge', getGradeColor(grade))}>
                          {log.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
