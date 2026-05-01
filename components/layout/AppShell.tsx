'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { UserRole } from '@/lib/types';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  userName: string;
  role: UserRole;
}

export default function AppShell({ children, title, userName, role }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar role={role} userName={userName} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title={title}
          userName={userName}
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
