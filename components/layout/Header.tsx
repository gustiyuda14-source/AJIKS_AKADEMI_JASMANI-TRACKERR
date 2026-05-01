'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface HeaderProps {
  title: string;
  userName: string;
  role: UserRole;
  onMenuClick: () => void;
}

export default function Header({ title, userName, role, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-dark-border bg-dark-card/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left: menu toggle + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="btn-ghost p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold text-dark-text hidden sm:block">{title}</h1>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-2">
        <button className="btn-ghost p-2 relative" aria-label="Notifikasi">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-border/40 border border-dark-border">
          <User className="w-4 h-4 text-dark-muted" />
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-dark-text leading-tight max-w-[120px] truncate">{userName}</p>
            <p className="text-[10px] text-dark-muted leading-tight capitalize">{role}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="btn-ghost p-2 text-dark-muted hover:text-red-400"
          aria-label="Keluar"
          title="Keluar"
        >
          {signingOut
            ? <span className="w-4 h-4 border-2 border-dark-muted border-t-red-400 rounded-full animate-spin block" />
            : <LogOut className="w-4 h-4" />
          }
        </button>
      </div>
    </header>
  );
}
