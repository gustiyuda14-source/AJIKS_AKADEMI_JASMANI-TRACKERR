import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export const metadata = { title: 'Pengaturan — AJIKS Tracker' };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const role = user.user_metadata?.role ?? 'pelatih';
  if (role !== 'admin') redirect('/dashboard');

  const { data: members } = await supabase
    .from('members')
    .select('id, name, gender, category, weight_now, height, created_at')
    .order('name');

  // Fetch auth users list via admin is not available from client — we show member management only
  return <SettingsClient members={members ?? []} />;
}
