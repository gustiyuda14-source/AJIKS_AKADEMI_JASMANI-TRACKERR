import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';
import type { UserRole } from '@/lib/types';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':             'Dashboard Utama',
  '/ipdn/input':            'Input Jasmani — IPDN',
  '/ipdn/rekap/harian':     'Rekap Harian — IPDN',
  '/ipdn/rekap/mingguan':   'Rekap Mingguan — IPDN',
  '/ipdn/rekap/bulanan':    'Rekap Bulanan — IPDN',
  '/tni-polri/input':       'Input Jasmani — TNI/Polri',
  '/tni-polri/rekap/harian':    'Rekap Harian — TNI/Polri',
  '/tni-polri/rekap/mingguan':  'Rekap Mingguan — TNI/Polri',
  '/tni-polri/rekap/bulanan':   'Rekap Bulanan — TNI/Polri',
  '/settings':              'Pengaturan Sistem',
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const role  = (user.user_metadata?.role as UserRole) ?? 'pelatih';
  const email = user.email ?? '';
  const name  = user.user_metadata?.full_name ?? email.split('@')[0];

  return (
    <AppShell title="AJIKS Tracker" userName={name} role={role}>
      {children}
    </AppShell>
  );
}
