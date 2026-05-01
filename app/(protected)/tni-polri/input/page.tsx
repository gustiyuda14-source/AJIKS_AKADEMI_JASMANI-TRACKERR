import JasmaniInputForm from '@/components/forms/JasmaniInputForm';
import { Shield } from 'lucide-react';

export const metadata = { title: 'Input Jasmani TNI/Polri — AJIKS Tracker' };

export default function TniPolriInputPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-fire/10 border border-fire/20">
          <Shield className="w-5 h-5 text-fire" />
        </div>
        <div>
          <h1 className="section-title">Input Jasmani — TNI / Polri</h1>
          <p className="section-sub">Penilaian SAMAPTA untuk personel TNI dan Polri</p>
        </div>
      </div>
      <div className="card">
        <JasmaniInputForm category="tni-polri" />
      </div>
    </div>
  );
}
