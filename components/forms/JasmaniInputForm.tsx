'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { calcScore, getItemScore, getGradeColor, getScoreColor } from '@/lib/scoring';
import { TESTS } from '@/lib/constants';
import type { Gender, Member, Category, TestKey } from '@/lib/types';
import clsx from 'clsx';
import { Save, RefreshCw, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface FormData {
  memberId: string;
  date: string;
  weightNow: string;
  run12: string;
  fig8: string;
  pushup: string;
  situp: string;
  pullup: string;
  notes: string;
}

const defaultForm: FormData = {
  memberId: '',
  date: new Date().toISOString().slice(0, 10),
  weightNow: '',
  run12: '',
  fig8: '',
  pushup: '',
  situp: '',
  pullup: '',
  notes: '',
};

interface Props {
  category: Category;
}

export default function JasmaniInputForm({ category }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm]       = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const selectedMember = members.find(m => m.id === form.memberId);
  const gender: Gender = selectedMember?.gender ?? 'L';

  // Derive scores live
  const scores = calcScore(gender, {
    run12:  parseFloat(form.run12)  || 0,
    fig8:   parseFloat(form.fig8)   || 0,
    pushup: parseInt(form.pushup)   || 0,
    situp:  parseInt(form.situp)    || 0,
    pullup: parseInt(form.pullup)   || 0,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('members')
      .select('*')
      .eq('category', category)
      .order('name')
      .then(({ data }) => setMembers(data ?? []));
  }, [category]);

  function handleChange(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSuccess('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.memberId) { setError('Pilih anggota terlebih dahulu.'); return; }

    setLoading(true);
    setError('');

    const supabase = createClient();

    const payload = {
      member_id:  form.memberId,
      date:       form.date,
      run12:      parseFloat(form.run12)  || null,
      fig8:       parseFloat(form.fig8)   || null,
      pushup:     parseInt(form.pushup)   || null,
      situp:      parseInt(form.situp)    || null,
      pullup:     parseInt(form.pullup)   || null,
      weight_now: parseFloat(form.weightNow) || null,
      score:      scores.score,
      grade:      scores.grade,
      notes:      form.notes || null,
    };

    const { error: insertError } = await supabase
      .from('exercise_logs')
      .insert(payload);

    if (insertError) {
      setError(`Gagal menyimpan: ${insertError.message}`);
      setLoading(false);
      return;
    }

    // Update member's latest values
    await supabase.from('members').update({
      weight_now: payload.weight_now ?? undefined,
      run12:  payload.run12 ?? undefined,
      fig8:   payload.fig8  ?? undefined,
      pushup: payload.pushup ?? undefined,
      situp:  payload.situp  ?? undefined,
      pullup: payload.pullup ?? undefined,
    }).eq('id', form.memberId);

    setSuccess(`Data berhasil disimpan! Skor: ${scores.score} — Grade: ${scores.grade}`);
    setForm(prev => ({ ...defaultForm, date: prev.date }));
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback */}
      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Identitas */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-dark-text border-b border-dark-border pb-2">
            Identitas & Tanggal
          </h2>

          <div>
            <label className="form-label flex items-center gap-1">
              <User className="w-3 h-3" /> Anggota
            </label>
            <select
              required
              value={form.memberId}
              onChange={e => handleChange('memberId', e.target.value)}
              className="form-input"
            >
              <option value="">— Pilih Anggota —</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.gender === 'L' ? '♂' : '♀'})
                </option>
              ))}
            </select>
          </div>

          {/* Gender indicator (read-only, from member) */}
          {selectedMember && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-border/30 border border-dark-border text-sm">
              <span className="text-lg">{selectedMember.gender === 'L' ? '♂' : '♀'}</span>
              <div>
                <p className="text-dark-text font-medium">{selectedMember.name}</p>
                <p className="text-dark-muted text-xs">
                  {selectedMember.gender === 'L' ? 'Pria — Standar Laki-laki' : 'Wanita — Standar Perempuan'}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="form-label flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Tanggal
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Berat Badan Terkini (kg)</label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="200"
              value={form.weightNow}
              onChange={e => handleChange('weightNow', e.target.value)}
              placeholder="70.5"
              className="form-input"
            />
          </div>
        </div>

        {/* Right: Live Score Preview */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-dark-text border-b border-dark-border pb-2">
            Preview Skor (Real-time)
          </h2>

          <div className="rounded-xl border border-dark-border bg-dark-bg/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-muted">Nilai A (Lari 12 mnt)</span>
              <span className={clsx('font-mono text-sm font-bold', getScoreColor(scores.nilaiA))}>
                {scores.nilaiA}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-muted">Nilai B (Rata-rata)</span>
              <span className={clsx('font-mono text-sm font-bold', getScoreColor(scores.nilaiB))}>
                {scores.nilaiB}
              </span>
            </div>

            <div className="h-px bg-dark-border" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-text">Skor Akhir</span>
              <span className={clsx('font-mono text-2xl font-bold', getScoreColor(scores.score))}>
                {scores.score}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-muted">Grade</span>
              <span className={clsx('badge text-sm font-bold', getGradeColor(scores.grade))}>
                {scores.grade}
              </span>
            </div>

            {scores.isTms && (
              <p className="text-xs text-red-400 bg-red-500/10 rounded p-2">
                ⚠ Ada item di bawah nilai minimal (41). Status: TMS
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Test Inputs */}
      <div>
        <h2 className="text-sm font-semibold text-dark-text border-b border-dark-border pb-2 mb-4">
          Data Tes Fisik
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {TESTS.map(test => {
            const val    = parseFloat(form[test.key as keyof FormData] as string) || 0;
            const iScore = getItemScore(gender, test.key, val);
            const target = gender === 'L' ? test.targetM : test.targetF;

            return (
              <div key={test.key} className="card space-y-2">
                <div className="flex items-center justify-between">
                  <label className="form-label mb-0 flex items-center gap-1">
                    {test.icon} {test.name}
                  </label>
                  <span className={clsx('text-xs font-mono font-bold', getScoreColor(iScore))}>
                    {iScore > 0 ? iScore : '—'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={test.unit === 'dtk' ? '0.1' : '1'}
                    min="0"
                    value={form[test.key as keyof FormData] as string}
                    onChange={e => handleChange(test.key as keyof FormData, e.target.value)}
                    placeholder="0"
                    className="form-input flex-1"
                  />
                  <span className="text-xs text-dark-muted w-8">{test.unit}</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-dark-muted mb-1">
                    <span>0</span>
                    <span>Target: {target} {test.unit}</span>
                  </div>
                  <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all', {
                        'bg-green-500':  iScore >= 80,
                        'bg-yellow-500': iScore >= 61 && iScore < 80,
                        'bg-orange-500': iScore >= 41 && iScore < 61,
                        'bg-red-500':    iScore < 41,
                      })}
                      style={{ width: `${Math.min(iScore, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="form-label">Catatan Pelatih (Opsional)</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={e => handleChange('notes', e.target.value)}
          placeholder="Catatan kondisi fisik, kemajuan, atau hal yang perlu diperhatikan..."
          className="form-input resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Save className="w-4 h-4" />
          }
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
        <button
          type="button"
          onClick={() => setForm(defaultForm)}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </form>
  );
}
