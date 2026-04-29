# AJIKS Akademi Jasmani Tracker

Sistem monitoring dan tracking perkembangan fisik anggota AJIKS Akademi Jasmani dengan fokus pada persiapan IPDN 2026.

## 🎯 Fitur Utama

- **Dashboard Analitik** - Visualisasi data perkembangan fisik dengan grafik interaktif
- **Monitoring Harian, Mingguan, Bulanan** - Track progress dalam berbagai timeframe
- **Manajemen Anggota** - CRUD operations untuk member list
- **Physical Test Tracker** - 5 tes standar POLRI:
  - Lari 12 Menit (Run)
  - Lari Angka 8 (Figure 8)
  - Push Up
  - Sit Up
  - Pull Up
- **Scoring System** - Sistem penilaian profesional berdasarkan standar POLRI
- **Coach Mode** - Tools untuk pelatih (counter dan stopwatch)
- **Export CSV** - Export data anggota ke format CSV
- **Cloud Storage** - Integrasi Supabase untuk penyimpanan data cloud

## 🚀 Quick Start

### 1. Akses Aplikasi

Aplikasi sudah di-deploy di: [ajiks-akademi-jasmani-trackerr.vercel.app](https://ajiks-akademi-jasmani-trackerr.vercel.app)

### 2. Setup Supabase (Optional)

Untuk menyimpan data ke cloud, setup Supabase:
- Ikuti panduan lengkap di [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Tanpa Supabase, data tersimpan lokal di browser saja

### 3. Mulai Gunakan

1. **Tambah Anggota** - Klik "Kelola Anggota" → "Tambah Anggota Pertama"
2. **Input Data Fisik** - Klik "+ Input Latihan Hari Ini"
3. **Lihat Progress** - Buka tab Harian/Mingguan/Bulanan untuk analisis

## 📁 Project Structure

```
.
├── public/
│   └── index.html          # Single-page application (HTML + CSS + JS)
├── vercel.json             # Deployment configuration
├── SUPABASE_SETUP.md       # Setup guide for cloud storage
└── README.md               # This file
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js untuk visualisasi data
- **Cloud**: Supabase (PostgreSQL + REST API)
- **Deployment**: Vercel

## 💾 Data Persistence

### Local Storage
- Default: Data tersimpan di browser (localStorage)
- Persisten selama cache browser tidak dihapus
- Tidak bisa diakses dari device lain

### Supabase (Cloud)
- Setup diperlukan (lihat SUPABASE_SETUP.md)
- Data tersimpan di server cloud Supabase
- Bisa diakses dari device manapun
- Backup otomatis

## 🎮 Fitur Coach Mode

Tekan tombol ⚙️ di kanan atas untuk akses Coach Mode:

- **Counter**: Untuk tracking Push Up, Sit Up, Pull Up
- **Stopwatch**: Untuk timing Lari Angka 8
- **Realtime Input**: Untuk input cepat saat test sedang berjalan

## 📊 Scoring System

Sistem penilaian mengikuti standar POLRI:

- **Nilai 100**: Perfect score (sesuai target test)
- **Nilai 1-99**: Berkurang sesuai dengan performa
- **Nilai 0**: Tidak lulus (TMS - Tidak Masuk Standar)

Grade diberikan berdasarkan score:
- **A (90-100)**: Excellent
- **B (80-89)**: Good
- **C (60-79)**: Adequate
- **D (<60)**: Needs Improvement

## 🔧 Browser Requirements

- Chrome, Firefox, Safari, Edge (versi terbaru)
- JavaScript harus enabled
- LocalStorage harus enabled

## ⚡ Performance

- Single-file application (cepat load)
- No build process diperlukan
- Responsive design untuk desktop dan tablet
- Chart rendering optimized

## 📱 Responsive

- Desktop: Full layout
- Tablet: Adjusted layout
- Mobile: Simplified layout (horizontal scroll untuk table)

## 🔐 Security Notes

- Data lokal: Aman di device saja (tidak dikirim ke server)
- Supabase: Gunakan Anon Key, jangan expose di public
- RLS Policies: Sudah dikonfigurasi untuk data isolation

## 📈 Future Enhancements

- [ ] Authentication & user roles
- [ ] Mobile app (native iOS/Android)
- [ ] Advanced analytics & reporting
- [ ] Integration dengan wearables
- [ ] Notifications & alerts
- [ ] Bulk import data

## 📝 License

Internal use for AJIKS Akademi only.

## 👥 Contributors

- Development Team

## 📞 Support

Untuk masalah teknis atau pertanyaan, hubungi tim development.

---

**Last Updated**: April 2026  
**Status**: Active Development
