import LoginForm from '@/components/auth/LoginForm';
import { Flame } from 'lucide-react';

export const metadata = { title: 'Login — AJIKS Tracker' };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-fire/10 border border-fire/30 mb-4">
            <Flame className="w-8 h-8 text-fire" />
          </div>
          <h1 className="text-2xl font-bold text-dark-text">AJIKS Tracker</h1>
          <p className="text-dark-muted text-sm mt-1">Akademi Jasmani — Sistem Penilaian SAMAPTA</p>
        </div>

        {/* Form Card */}
        <div className="card">
          <h2 className="text-lg font-semibold text-dark-text mb-5">Masuk ke Akun Anda</h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-dark-muted mt-6">
          Standar Penilaian: POLRI SAMAPTA v2025
        </p>
      </div>
    </main>
  );
}
