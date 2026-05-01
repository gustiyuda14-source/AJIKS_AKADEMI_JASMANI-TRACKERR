'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Member, Gender, Category } from '@/lib/types';
import { Settings, UserPlus, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  members: Partial<Member>[];
}

const defaultForm = {
  name: '',
  gender: 'L' as Gender,
  category: 'ipdn' as Category,
  weight_init: '',
  weight_now: '',
  height: '',
};

export default function SettingsClient({ members: initMembers }: Props) {
  const [members, setMembers]     = useState(initMembers);
  const [form, setForm]           = useState(defaultForm);
  const [saving, setSaving]       = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'users'>('members');

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const existing = members.filter(m => m.category === form.category);
    const nextNum  = String(existing.length + 1).padStart(3, '0');
    const id       = `${form.category === 'ipdn' ? 'I' : 'T'}${nextNum}`;

    const { error } = await supabase.from('members').insert({
      id,
      name:        form.name.trim(),
      gender:      form.gender,
      category:    form.category,
      weight_init: parseFloat(form.weight_init) || null,
      weight_now:  parseFloat(form.weight_now)  || null,
      height:      parseFloat(form.height)       || null,
      run12: 0, fig8: 0, pushup: 0, situp: 0, pullup: 0,
    });

    if (error) {
      setMessage({ type: 'err', text: `Gagal: ${error.message}` });
    } else {
      setMessage({ type: 'ok', text: `Anggota "${form.name}" berhasil ditambahkan.` });
      setForm(defaultForm);
      const { data } = await supabase.from('members').select('*').order('name');
      setMembers(data ?? []);
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus anggota "${name}"? Semua log latihan juga akan dihapus.`)) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from('exercise_logs').delete().eq('member_id', id);
    await supabase.from('members').delete().eq('id', id);
    setMembers(prev => prev.filter(m => m.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
          <Settings className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="section-title">Pengaturan Sistem</h1>
          <p className="section-sub">Manajemen anggota dan konfigurasi aplikasi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-border">
        {(['members', 'users'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors', activeTab === tab
              ? 'border-fire text-fire'
              : 'border-transparent text-dark-muted hover:text-dark-text'
            )}
          >
            {tab === 'members' ? 'Manajemen Anggota' : 'Kelola Akun Pengguna'}
          </button>
        ))}
      </div>

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Add Member */}
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-dark-text flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-fire" />
              Tambah Anggota Baru
            </h2>

            {message && (
              <div className={clsx('flex items-center gap-2 rounded-lg px-3 py-2 text-sm', message.type === 'ok'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
              )}>
                {message.type === 'ok'
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <XCircle    className="w-4 h-4 flex-shrink-0" />
                }
                {message.text}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  required
                  minLength={3}
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ahmad Kafir"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm(p => ({ ...p, gender: e.target.value as Gender }))}
                    className="form-input"
                  >
                    <option value="L">♂ Laki-laki</option>
                    <option value="P">♀ Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Kategori</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}
                    className="form-input"
                  >
                    <option value="ipdn">IPDN</option>
                    <option value="tni-polri">TNI / Polri</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">BB Awal (kg)</label>
                  <input type="number" step="0.1" value={form.weight_init}
                    onChange={e => setForm(p => ({ ...p, weight_init: e.target.value }))}
                    placeholder="70" className="form-input" />
                </div>
                <div>
                  <label className="form-label">BB Sekarang</label>
                  <input type="number" step="0.1" value={form.weight_now}
                    onChange={e => setForm(p => ({ ...p, weight_now: e.target.value }))}
                    placeholder="70" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Tinggi (cm)</label>
                  <input type="number" value={form.height}
                    onChange={e => setForm(p => ({ ...p, height: e.target.value }))}
                    placeholder="170" className="form-input" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <UserPlus className="w-4 h-4" />
                }
                {saving ? 'Menyimpan...' : 'Tambah Anggota'}
              </button>
            </form>
          </div>

          {/* Member List */}
          <div className="card space-y-3">
            <h2 className="text-sm font-semibold text-dark-text">
              Daftar Anggota ({members.length})
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {members.length === 0 && (
                <p className="text-sm text-dark-muted text-center py-8">Belum ada anggota.</p>
              )}
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border">
                  <div>
                    <p className="text-sm font-medium text-dark-text">{m.name}</p>
                    <p className="text-xs text-dark-muted">
                      {m.gender === 'L' ? '♂' : '♀'} · {m.category?.toUpperCase()} · ID: {m.id}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id!, m.name!)}
                    disabled={deletingId === m.id}
                    className="btn-danger flex items-center gap-1"
                  >
                    {deletingId === m.id
                      ? <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
                      : <Trash2 className="w-3 h-3" />
                    }
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h2 className="text-sm font-semibold text-dark-text mb-4">Kelola Pengguna (Admin Only)</h2>
          <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border text-sm text-dark-muted space-y-2">
            <p>Untuk menambah atau mengubah peran pengguna (Admin / Pelatih), gunakan Supabase Dashboard:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Buka <strong className="text-dark-text">Authentication → Users</strong></li>
              <li>Klik pengguna yang ingin diubah</li>
              <li>Edit bagian <code className="bg-dark-border px-1 rounded">user_metadata</code></li>
              <li>Tambahkan: <code className="bg-dark-border px-1 rounded">{`{"role": "admin"}`}</code> atau <code className="bg-dark-border px-1 rounded">{`{"role": "pelatih"}`}</code></li>
              <li>Klik <strong className="text-dark-text">Save</strong></li>
            </ol>
            <p className="pt-2">Default role saat registrasi: <span className="badge text-fire border-fire/30 bg-fire/10">pelatih</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
