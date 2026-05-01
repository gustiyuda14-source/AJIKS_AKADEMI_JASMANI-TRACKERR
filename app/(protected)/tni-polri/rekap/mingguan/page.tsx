import RekapView from '@/components/rekap/RekapView';
import { CalendarRange } from 'lucide-react';

export const metadata = { title: 'Rekap Mingguan TNI/Polri — AJIKS Tracker' };

export default function TniPolriRekapMingguanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-fire/10 border border-fire/20">
          <CalendarRange className="w-5 h-5 text-fire" />
        </div>
        <div>
          <h1 className="section-title">Rekap Mingguan — TNI / Polri</h1>
          <p className="section-sub">Laporan sesi latihan per minggu</p>
        </div>
      </div>
      <div className="card">
        <RekapView category="tni-polri" period="mingguan" title="Rekap Mingguan TNI/Polri" />
      </div>
    </div>
  );
}
