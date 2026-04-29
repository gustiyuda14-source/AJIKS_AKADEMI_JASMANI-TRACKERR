# Supabase Setup Guide - AJIKS Akademi Jasmani Tracker

Panduan lengkap untuk mengintegrasikan Supabase dengan aplikasi AJIKS Akademi Jasmani Tracker sehingga data tersimpan ke cloud.

## 📋 Prerequisites

- Akun Supabase (gratis di https://supabase.com)
- Browser modern dengan akses ke aplikasi Jasmani Tracker

## 🚀 Step-by-Step Setup

### 1. Buat Project Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Login atau buat akun baru
3. Klik "New Project"
4. Isi detail project:
   - **Name**: `ajiks-akademi-jasmani` (atau sesuai preferensi)
   - **Password**: Buat password yang kuat (untuk database PostgreSQL)
   - **Region**: Pilih region terdekat dengan Indonesia (e.g., Singapore)
5. Klik "Create new project" dan tunggu hingga selesai (biasanya 1-2 menit)

### 2. Buat Tabel Members

Setelah project terbuat, ikuti langkah ini:

1. Di dashboard Supabase, pergi ke **SQL Editor** (klik menu di sebelah kiri)
2. Klik **New Query**
3. Copy & paste SQL berikut:

```sql
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  weight_init DECIMAL(5,2) NOT NULL,
  weight_now DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  latest JSONB DEFAULT '{"run12":0,"fig8":0,"pushup":0,"situp":0,"pullup":0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_members_name ON members(name);

-- Enable RLS (Row Level Security) - opsional tapi recommended
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (untuk testing)
CREATE POLICY "Allow public read"
ON members FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public write"
ON members FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update"
ON members FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete"
ON members FOR DELETE
TO public
USING (true);
```

4. Klik **Run** dan tunggu hingga query berhasil dijalankan
5. Verifikasi: Pergi ke **Table Editor** dan pastikan tabel `members` sudah ada

### 3. Dapatkan API Credentials

1. Di dashboard Supabase, pergi ke **Settings** (roda gigi di bawah)
2. Klik **API** di menu sebelah kiri
3. Catat dua informasi penting:
   - **Project URL**: URL lengkap project Anda (contoh: `https://xxxxxx.supabase.co`)
   - **Anon Key**: Public API key (anon/public)

> ⚠️ **Penting**: Jangan share API Key dengan orang lain!

### 4. Konfigurasi di Aplikasi

1. Buka aplikasi **AJIKS Akademi Jasmani Tracker**
2. Di navbar (bagian atas), klik tombol **⚡ Setup DB**
3. Dialog akan muncul meminta:
   - **Supabase URL**: Paste Project URL dari langkah 3
   - **Supabase Anon Key**: Paste Anon Key dari langkah 3
4. Klik **OK** untuk menyimpan konfigurasi
5. Halaman akan refresh otomatis

### 5. Verifikasi Koneksi

Setelah konfigurasi:

1. Buka **Console Browser** (F12 → Console)
2. Cari pesan `✅ Supabase connected` - ini menandakan koneksi berhasil
3. Coba tambah member baru:
   - Klik **+ Input Latihan Hari Ini** atau **Kelola Anggota**
   - Isi form dan klik **Simpan Anggota**
   - Pesan alert akan menunjukkan apakah berhasil tersimpan ke Supabase

4. Verifikasi di Supabase:
   - Buka **Table Editor** → **members**
   - Pastikan data member yang baru ditambah sudah ada di sini

## ✅ Fitur yang Sudah Terintegrasi

Dengan Supabase setup, operasi berikut akan otomatis tersimpan ke cloud:

- ✅ **Tambah Member** - Disimpan ke Supabase
- ✅ **Edit Member** - Perubahan disimpan ke Supabase
- ✅ **Hapus Member** - Dihapus dari Supabase
- ✅ **Load Data** - Otomatis load dari Supabase saat app start

## 📊 Data Loading

Data akan otomatis dimuat dari Supabase setiap kali:

1. Halaman di-refresh
2. Browser di-buka kembali
3. App pertama kali diakses

Jika Supabase tidak konfigurasi, app akan menggunakan data lokal (hanya tersimpan di browser).

## 🔍 Troubleshooting

### Pesan "⚠️ Supabase not configured"

**Solusi**: Klik tombol **⚡ Setup DB** dan masukkan credentials Supabase Anda.

### Koneksi Gagal / "❌ Error saving to Supabase"

Kemungkinan penyebab:

1. **URL atau Key salah** → Periksa kembali di Settings → API
2. **Tabel belum dibuat** → Jalankan SQL Query dari step 2
3. **RLS Policy error** → Pastikan RLS policies sudah dibuat (lihat SQL di step 2)
4. **Network/Firewall** → Periksa koneksi internet

**Debug**: Buka Console (F12) dan lihat error message lengkapnya.

### Data tidak muncul setelah refresh

1. Verifikasi data ada di Table Editor → members
2. Periksa Console (F12) untuk error message
3. Coba bersihkan browser cache (Ctrl+Shift+Delete)

## 🔐 Security Notes

- **Anon Key**: Digunakan untuk public access (cocok untuk development)
- Untuk production, setup proper RLS policies (lihat SQL di step 2)
- Jangan expose API Key di public repository

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

Jika ada masalah, periksa:

1. Console browser (F12 → Console tab)
2. Verifikasi URL dan Key di Settings → API Supabase
3. Pastikan tabel members sudah dibuat dengan schema yang benar

---

**Last Updated**: April 2026
