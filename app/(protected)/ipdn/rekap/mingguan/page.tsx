import RekapView from '@/components/rekap/RekapView';
import { CalendarRange } from 'lucide-react';

export const metadata = { title: 'Rekap Mingguan IPDN — AJIKS Tracker' };

export default function IpdnRekapMingguanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <CalendarRange className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="section-title">Rekap Mingguan — IPDN</h1>
          <p className="section-sub">Laporan sesi latihan per minggu</p>
        </div>
      </div>
      <div className="card">
        <RekapView category="ipdn" period="mingguan" title="Rekap Mingguan IPDN" />
      </div>
    </div>
  );
}
