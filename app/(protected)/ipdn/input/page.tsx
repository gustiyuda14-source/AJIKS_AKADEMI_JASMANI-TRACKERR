import JasmaniInputForm from '@/components/forms/JasmaniInputForm';
import { GraduationCap } from 'lucide-react';

export const metadata = { title: 'Input Jasmani IPDN — AJIKS Tracker' };

export default function IpdnInputPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <GraduationCap className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="section-title">Input Jasmani — IPDN</h1>
          <p className="section-sub">Penilaian SAMAPTA untuk peserta didik IPDN</p>
        </div>
      </div>
      <div className="card">
        <JasmaniInputForm category="ipdn" />
      </div>
    </div>
  );
}
