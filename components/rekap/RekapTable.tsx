'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getGradeColor, getScoreColor } from '@/lib/scoring';
import type { ExerciseLog, Grade } from '@/lib/types';
import clsx from 'clsx';
import { Pencil, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import PrintButton from '@/components/ui/PrintButton';

interface Props {
  logs: ExerciseLog[];
  title: string;
  onRefresh: () => void;
}

interface EditState {
  id: string;
  run12: string;
  fig8: string;
  pushup: string;
  situp: string;
  pullup: string;
  notes: string;
}

export default function RekapTable({ logs, title, onRefresh }: Props) {
  const [editId, setEditId]     = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [sortField, setSortField] = useState<'date' | 'score'>('date');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc');

  const sorted = [...logs].sort((a, b) => {
    const va = sortField === 'date' ? new Date(a.date).getTime() : a.score;
    const vb = sortField === 'date' ? new Date(b.date).getTime() : b.score;
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  function startEdit(log: ExerciseLog) {
    setEditId(log.id);
    setEditState({
      id:     log.id,
      run12:  String(log.run12 ?? ''),
      fig8:   String(log.fig8 ?? ''),
      pushup: String(log.pushup ?? ''),
      situp:  String(log.situp ?? ''),
      pullup: String(log.pullup ?? ''),
      notes:  log.notes ?? '',
    });
  }

  function cancelEdit() {
    setEditId(null);
    setEditState(null);
  }

  async function saveEdit() {
    if (!editState) return;
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('exercise_logs')
      .update({
        run12:  parseFloat(editState.run12)  || null,
        fig8:   parseFloat(editState.fig8)   || null,
        pushup: parseInt(editState.pushup)   || null,
        situp:  parseInt(editState.situp)    || null,
        pullup: parseInt(editState.pullup)   || null,
        notes:  editState.notes || null,
      })
      .eq('id', editState.id);

    setSaving(false);
    if (!error) {
      cancelEdit();
      onRefresh();
    } else {
      alert('Gagal menyimpan: ' + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus log ini? Tindakan tidak dapat dibatalkan.')) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from('exercise_logs').delete().eq('id', id);
    setDeletingId(null);
    onRefresh();
  }

  function toggleSort(field: 'date' | 'score') {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const SortIcon = ({ field }: { field: 'date' | 'score' }) =>
    sortField === field
      ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />
      : null;

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-muted">{logs.length} entri</p>
        <PrintButton title={title} contentId="rekap-table-content" />
      </div>

      {/* Table */}
      <div id="rekap-table-content" className="overflow-x-auto rounded-xl border border-dark-border">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr>
              <th className="table-head text-left cursor-pointer" onClick={() => toggleSort('date')}>
                Tanggal <SortIcon field="date" />
              </th>
              <th className="table-head text-left">Anggota</th>
              <th className="table-head text-center">Lari 12m</th>
              <th className="table-head text-center">Angka 8</th>
              <th className="table-head text-center">Push</th>
              <th className="table-head text-center">Sit</th>
              <th className="table-head text-center">Pull</th>
              <th className="table-head text-center cursor-pointer" onClick={() => toggleSort('score')}>
                Skor <SortIcon field="score" />
              </th>
              <th className="table-head text-center">Grade</th>
              <th className="table-head text-center no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={10} className="table-cell text-center text-dark-muted py-10">
                  Belum ada data untuk periode ini.
                </td>
              </tr>
            )}
            {sorted.map(log => {
              const isEditing = editId === log.id;
              const grade = (log.grade ?? 'D') as Grade;

              return (
                <tr key={log.id} className={clsx('hover:bg-dark-border/20 transition-colors', isEditing && 'bg-dark-border/30')}>
                  <td className="table-cell whitespace-nowrap">
                    {new Date(log.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="table-cell">
                    <p className="font-medium truncate max-w-[100px]">{log.members?.name ?? '—'}</p>
                    <p className="text-xs text-dark-muted">{log.members?.gender === 'L' ? '♂' : '♀'}</p>
                  </td>

                  {(['run12', 'fig8', 'pushup', 'situp', 'pullup'] as const).map(key => (
                    <td key={key} className="table-cell text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          step={key === 'fig8' ? '0.1' : '1'}
                          value={editState![key as keyof EditState] as string}
                          onChange={e => setEditState(s => s ? { ...s, [key]: e.target.value } : s)}
                          className="form-input w-20 text-center text-xs py-1 px-2"
                        />
                      ) : (
                        <span className="font-mono">{(log[key] ?? '—')}</span>
                      )}
                    </td>
                  ))}

                  <td className="table-cell text-center">
                    <span className={clsx('font-mono font-bold', getScoreColor(log.score))}>
                      {log.score}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <span className={clsx('badge', getGradeColor(grade))}>{grade}</span>
                  </td>

                  {/* Actions */}
                  <td className="table-cell text-center no-print">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="p-1.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                          title="Simpan"
                        >
                          {saving
                            ? <span className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin block" />
                            : <Save className="w-3 h-3" />
                          }
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded bg-dark-border/50 text-dark-muted hover:text-dark-text transition-colors"
                          title="Batal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEdit(log)}
                          className="p-1.5 rounded bg-dark-border/50 text-dark-muted hover:text-gold hover:bg-gold/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={deletingId === log.id}
                          className="p-1.5 rounded bg-dark-border/50 text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus"
                        >
                          {deletingId === log.id
                            ? <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
                            : <Trash2 className="w-3 h-3" />
                          }
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
