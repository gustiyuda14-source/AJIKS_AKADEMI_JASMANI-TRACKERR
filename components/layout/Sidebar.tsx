'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import {
  LayoutDashboard,
  GraduationCap,
  Shield,
  Settings,
  ChevronDown,
  ClipboardList,
  CalendarDays,
  CalendarRange,
  Calendar,
  Flame,
  X,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
  adminOnly?: boolean;
}

function buildNav(role: UserRole): NavItem[] {
  const rekapChildren = (base: string) => [
    { label: 'Input Jasmani',   href: `${base}/input`,          icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Rekap Harian',    href: `${base}/rekap/harian`,   icon: <CalendarDays className="w-4 h-4" /> },
    { label: 'Rekap Mingguan',  href: `${base}/rekap/mingguan`, icon: <CalendarRange className="w-4 h-4" /> },
    { label: 'Rekap Bulanan',   href: `${base}/rekap/bulanan`,  icon: <Calendar className="w-4 h-4" /> },
  ];

  const items: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'IPDN',
      icon: <GraduationCap className="w-5 h-5" />,
      children: rekapChildren('/ipdn'),
    },
  ];

  if (role === 'admin') {
    items.push({
      label: 'TNI / Polri',
      icon: <Shield className="w-5 h-5" />,
      children: rekapChildren('/tni-polri'),
    });
    items.push({
      label: 'Pengaturan',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
      adminOnly: true,
    });
  } else {
    // Pelatih only gets IPDN input
    return items.filter(i =>
      i.href === '/dashboard' ||
      i.label === 'IPDN'
    ).map(i =>
      i.label === 'IPDN'
        ? { ...i, children: [i.children![0]] } // only Input Jasmani
        : i
    );
  }

  return items;
}

interface SidebarProps {
  role: UserRole;
  userName: string;
  onClose?: () => void;
}

export default function Sidebar({ role, userName, onClose }: SidebarProps) {
  const pathname = usePathname();
  const nav = buildNav(role);
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    return nav
      .filter(i => i.children?.some(c => pathname.startsWith(c.href)))
      .map(i => i.label);
  });

  function toggleGroup(label: string) {
    setOpenGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  }

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  }

  return (
    <aside className="flex flex-col h-full bg-dark-card border-r border-dark-border w-64">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-fire" />
          <div>
            <p className="text-sm font-bold text-dark-text leading-tight">AJIKS</p>
            <p className="text-[10px] text-dark-muted leading-tight">Jasmani Tracker</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-ghost p-1 md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b border-dark-border">
        <p className="text-xs text-dark-muted truncate">{userName}</p>
        <span className={clsx('badge mt-1', role === 'admin'
          ? 'text-gold border-gold/30 bg-gold/10'
          : 'text-fire border-fire/30 bg-fire/10'
        )}>
          {role === 'admin' ? '⚡ Admin' : '🏋️ Pelatih'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {nav.map(item => {
          if (item.href && !item.children) {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-all',
                  isActive(item.href)
                    ? 'bg-fire/10 text-fire'
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-border'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          }

          if (item.children) {
            const isOpen = openGroups.includes(item.label);
            const hasActive = item.children.some(c => isActive(c.href));

            return (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    hasActive
                      ? 'text-dark-text bg-dark-border/50'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-border'
                  )}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                  <div className="ml-4 mt-1 border-l border-dark-border pl-3 space-y-0.5">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={clsx(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all',
                          isActive(child.href)
                            ? 'text-fire bg-fire/10'
                            : 'text-dark-muted hover:text-dark-text hover:bg-dark-border'
                        )}
                      >
                        {child.icon}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-dark-border">
        <p className="text-[10px] text-dark-muted">Standar POLRI SAMAPTA v2025</p>
      </div>
    </aside>
  );
}
