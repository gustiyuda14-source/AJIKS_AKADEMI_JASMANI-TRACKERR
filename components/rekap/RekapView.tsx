'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import RekapTable from './RekapTable';
import type { ExerciseLog, Category } from '@/lib/types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths, format } from 'date-fns';
import { id } from 'date-fns/locale';

type PeriodType = 'harian' | 'mingguan' | 'bulanan';

interface Props {
  category: Category;
  period: PeriodType;
  title: string;
}

function getDateRange(period: PeriodType, offset: number) {
  const now = new Date();

  if (period === 'harian') {
    const d = subDays(now, offset);
    return {
      from: format(d, 'yyyy-MM-dd'),
      to:   format(d, 'yyyy-MM-dd'),
      label: offset === 0 ? 'Hari ini' : format(d, 'EEEE, d MMMM yyyy', { locale: id }),
    };
  }

  if (period === 'mingguan') {
    const ref  = subWeeks(now, offset);
    const from = startOfWeek(ref, { weekStartsOn: 1 });
    const to   = endOfWeek(ref, { weekStartsOn: 1 });
    return {
      from:  format(from, 'yyyy-MM-dd'),
      to:    format(to,   'yyyy-MM-dd'),
      label: offset === 0
        ? `Minggu ini (${format(from, 'd MMM', { locale: id })} – ${format(to, 'd MMM yyyy', { locale: id })})`
        : `Minggu ke-${offset + 1} lalu`,
    };
  }

  // bulanan
  const ref  = subMonths(now, offset);
  const from = startOfMonth(ref);
  const to   = endOfMonth(ref);
  return {
    from:  format(from, 'yyyy-MM-dd'),
    to:    format(to,   'yyyy-MM-dd'),
    label: format(ref, 'MMMM yyyy', { locale: id }),
  };
}

export default function RekapView({ category, period, title }: Props) {
  const [logs, setLogs]       = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset]   = useState(0);

  const range = getDateRange(period, offset);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('exercise_logs')
      .select('*, members(name, gender, category)')
      .gte('date', range.from)
      .lte('date', range.to)
      .eq('members.category', category)
      .order('date', { ascending: false });

    const filtered = (data ?? []).filter(
      (l: ExerciseLog) => l.members?.category === category
    );
    setLogs(filtered);
    setLoading(false);
  }, [range.from, range.to, category]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-5">
      {/* Period navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset(o => o + 1)}
            className="btn-secondary px-3 py-1.5 text-sm"
          >
            ← Sebelumnya
          </button>
          <span className="text-sm font-medium text-dark-text px-3 py-1.5 bg-dark-border/40 rounded-lg">
            {range.label}
          </span>
          {offset > 0 && (
            <button
              onClick={() => setOffset(o => o - 1)}
              className="btn-secondary px-3 py-1.5 text-sm"
            >
              Berikutnya →
            </button>
          )}
          {offset > 0 && (
            <button
              onClick={() => setOffset(0)}
              className="btn-ghost px-3 py-1.5 text-sm text-dark-muted"
            >
              Sekarang
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="w-6 h-6 border-2 border-dark-border border-t-fire rounded-full animate-spin" />
          <span className="ml-3 text-dark-muted text-sm">Memuat data...</span>
        </div>
      ) : (
        <RekapTable logs={logs} title={`${title} — ${range.label}`} onRefresh={fetchLogs} />
      )}
    </div>
  );
}
