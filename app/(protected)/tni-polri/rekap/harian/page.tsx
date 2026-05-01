import RekapView from '@/components/rekap/RekapView';
import { CalendarDays } from 'lucide-react';

export const metadata = { title: 'Rekap Harian TNI/Polri — AJIKS Tracker' };

export default function TniPolriRekapHarianPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-fire/10 border border-fire/20">
          <CalendarDays className="w-5 h-5 text-fire" />
        </div>
        <div>
          <h1 className="section-title">Rekap Harian — TNI / Polri</h1>
          <p className="section-sub">Laporan sesi latihan per hari</p>
        </div>
      </div>
      <div className="card">
        <RekapView category="tni-polri" period="harian" title="Rekap Harian TNI/Polri" />
      </div>
    </div>
  );
}
