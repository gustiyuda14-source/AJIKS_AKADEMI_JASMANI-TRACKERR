-- ============================================================
-- AJIKS AKADEMI JASMANI TRACKER — Schema v2
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tambah kolom `category` ke tabel members (jika belum ada)
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'ipdn'
    CHECK (category IN ('ipdn', 'tni-polri'));

-- 2. Tambah kolom `notes` ke exercise_logs (jika belum ada)
ALTER TABLE public.exercise_logs
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================================
-- 3. Update RLS: Autentikasi wajib (tidak lagi public)
-- ============================================================

-- Drop existing open policies
DROP POLICY IF EXISTS "public" ON public.members;
DROP POLICY IF EXISTS "public" ON public.exercise_logs;

-- Members: semua user terautentikasi bisa baca
CREATE POLICY "authenticated_read_members"
  ON public.members FOR SELECT
  USING (auth.role() = 'authenticated');

-- Members: hanya admin yang bisa INSERT/UPDATE/DELETE
-- (diimplementasi melalui RLS berdasarkan user_metadata.role)
CREATE POLICY "admin_write_members"
  ON public.members FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Exercise logs: semua user terautentikasi bisa baca
CREATE POLICY "authenticated_read_logs"
  ON public.exercise_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Exercise logs: admin dan pelatih bisa INSERT
CREATE POLICY "authenticated_insert_logs"
  ON public.exercise_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Exercise logs: admin bisa UPDATE dan DELETE, pelatih hanya bisa update log hari ini
CREATE POLICY "admin_update_logs"
  ON public.exercise_logs FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_delete_logs"
  ON public.exercise_logs FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================================
-- 4. Index untuk performa
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_exercise_logs_date      ON public.exercise_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_member_id ON public.exercise_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_members_category        ON public.members(category);

-- ============================================================
-- CATATAN PENTING — Cara Set Role Admin
-- ============================================================
-- Untuk menjadikan user sebagai Admin, jalankan query ini
-- di Supabase SQL Editor (ganti <user_uuid> dengan UUID user):
--
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE id = '<user_uuid>';
--
-- Untuk role Pelatih (default):
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "pelatih"}'::jsonb
-- WHERE id = '<user_uuid>';
-- ============================================================
