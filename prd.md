PRD: SIAKAD Multi-Sekolah Level Yayasan
Versi: 1.0 (Draft) · Tanggal: 28 September 2026 Stack: Laravel · Inertia.js · React (TypeScript) · Tailwind + shadcn/ui Tema UI: Putih elegan, aksen emerald

1. Ringkasan
SIAKAD (Sistem Informasi Akademik) adalah platform web terpusat bagi yayasan pendidikan yang menaungi banyak sekolah. Setiap sekolah mengelola operasional akademiknya sendiri, sementara yayasan memperoleh visibilitas konsolidasi lintas sekolah dalam satu sistem.

2. Latar Belakang & Masalah
Data akademik tersebar di spreadsheet dan aplikasi berbeda di tiap sekolah.
Yayasan sulit membandingkan kinerja antar sekolah secara cepat dan akurat.
Proses manual (absensi, nilai, rapor) memakan waktu guru dan TU.
Orang tua kurang mendapat akses transparan terhadap perkembangan anak.
Belum ada jejak audit untuk perubahan data sensitif seperti nilai dan pembayaran.
3. Tujuan & Metrik Keberhasilan
Tujuan	Metrik	Target
Sentralisasi data seluruh sekolah	Sekolah yang ter-onboard	100% dalam 6 bulan setelah rilis
Efisiensi guru	Waktu penyusunan rapor per kelas	Turun ≥ 60%
Transparansi ke orang tua	Orang tua aktif bulanan	≥ 70%
Visibilitas yayasan	Laporan konsolidasi tersedia real-time	Ya
Keandalan	Uptime	≥ 99,5%
Kinerja	Waktu muat halaman utama (p95)	< 2 detik
Bukan tujuan (v1): LMS/e-learning penuh, integrasi Dapodik dua arah, aplikasi mobile native.

4. Pengguna & Role
Role	Cakupan	Kebutuhan utama
Super Admin	Sistem	Konfigurasi global, manajemen yayasan
Admin Yayasan	Semua sekolah	Dashboard konsolidasi, kelola sekolah, laporan lintas sekolah
Kepala Sekolah	1 sekolah	Monitoring akademik, persetujuan, laporan
Admin Sekolah / TU	1 sekolah	Data master, PPDB, siswa, guru, jadwal
Guru	Kelas diampu	Absensi, input nilai, jurnal mengajar
Wali Kelas	Kelas perwalian	Rekap absensi, catatan siswa, rapor
Bendahara	1 sekolah	Tagihan, pembayaran, laporan keuangan
Siswa	Diri sendiri	Jadwal, nilai, absensi, tagihan
Orang Tua	Anak-anaknya	Pantau nilai, absensi, tagihan (multi-anak)
Satu akun dapat memiliki beberapa role di beberapa sekolah, dengan school switcher dan role switcher setelah login.

5. Ruang Lingkup Fitur
5.1 Fase 1: MVP (Prioritas P0)
ID	Modul	Kebutuhan fungsional
F-01	Autentikasi & otorisasi	Login, logout, reset password, RBAC per sekolah, school/role switcher, rate limiting
F-02	Master data	CRUD yayasan, sekolah, tahun ajaran, semester, jenjang, kelas, mata pelajaran, ruang; import/export Excel
F-03	Kepegawaian	Profil guru/staf, penugasan mengajar, penetapan wali kelas
F-04	Kesiswaan	Profil siswa, data orang tua/wali, penempatan kelas, mutasi (masuk, pindah, lulus)
F-05	Jadwal pelajaran	Penyusunan jadwal, deteksi bentrok guru dan ruang, tampilan per kelas/guru
F-06	Absensi	Input harian atau per mapel (hadir, izin, sakit, alpa), rekap otomatis
F-07	Penilaian	Komponen nilai berbobot, KKM, input nilai dengan grid, validasi rentang
F-08	Rapor	Template per sekolah, generate PDF per siswa dan batch per kelas, alur persetujuan
F-09	Dashboard per role	Ringkasan sesuai role dan cakupan data
5.2 Fase 2 (P1)
ID	Modul	Kebutuhan
F-10	Dashboard yayasan	Perbandingan antar sekolah: jumlah siswa, kehadiran, rata-rata nilai, tunggakan
F-11	Portal siswa & orang tua	Tampilan mobile-first, dukungan multi-anak
F-12	Keuangan	Jenis tagihan, SPP, pembayaran, tunggakan, laporan kas
F-13	Pengumuman & notifikasi	In-app dan email; WhatsApp gateway opsional
5.3 Fase 3 (P2)
PPDB online (pendaftaran, seleksi, penerimaan)
Jurnal mengajar dan catatan perilaku siswa
Payment gateway (virtual account / QRIS)
2FA, dark mode, laporan kustom
6. Kebutuhan Fungsional Utama (Detail)
Multi-tenancy

Semua data bertenant memiliki school_id; akses terfilter otomatis melalui global scope.
Pengguna hanya melihat data sekolah yang ditugaskan kepadanya; Admin Yayasan melihat seluruh sekolah dalam yayasannya.
Penilaian

Guru hanya dapat mengisi nilai mata pelajaran dan kelas yang diampu.
Nilai yang telah dikunci tidak dapat diubah kecuali dibuka oleh Kepala Sekolah/Admin, dan setiap perubahan tercatat di audit log.
Rapor

Rapor dihasilkan dari data nilai dan absensi semester berjalan.
Status: draft → diverifikasi wali kelas → disetujui kepala sekolah → dipublikasi ke portal.
Jadwal

Sistem menolak jadwal yang membuat satu guru atau satu ruang terpakai ganda di slot waktu sama.
7. Kebutuhan Non-Fungsional
Kategori	Kebutuhan
Keamanan	Hashing password, CSRF, rate limiting, validasi Form Request, enkripsi kolom sensitif (NIK), Policy di backend untuk setiap aksi
Isolasi data	Tes otomatis yang memastikan tidak ada kebocoran data antar sekolah
Privasi	Kepatuhan UU Pelindungan Data Pribadi (UU PDP); pembatasan akses data anak; kebijakan retensi data
Audit	Log seluruh perubahan nilai, pembayaran, dan data siswa (siapa, kapan, sebelum/sesudah)
Kinerja	p95 < 2 detik; pagination server-side; antrean (queue) untuk generate PDF dan impor massal
Ketersediaan	Uptime ≥ 99,5%; backup harian terenkripsi; uji pemulihan berkala
Skalabilitas	Minimal 50 sekolah dan 50.000 siswa aktif pada v1
Aksesibilitas	Kontras WCAG AA, navigasi keyboard, responsif 360px hingga desktop
Lokalisasi	Bahasa Indonesia sebagai default, zona waktu WIB/WITA/WIT
8. Desain UI/UX
Prinsip: bersih, lapang, fokus pada tugas. Emerald dipakai hemat untuk aksi utama dan status aktif.

Token	Nilai
Background	#FFFFFF
Surface	#F8FAF9
Border	#E5EBE8
Primary	emerald-600 (hover emerald-700)
Primary soft	emerald-50 / emerald-100
Teks	slate-900 / slate-500
Status	amber (peringatan), rose (error), sky (info)
Tipografi: Inter (isi), Plus Jakarta Sans (heading).
Komponen: radius rounded-xl, shadow halus, border tipis.
Interaksi: sidebar collapsible per role, command palette (Ctrl+K), data table dengan filter/sort/bulk action, skeleton loading, toast, dialog konfirmasi, form multi-step, transisi halus (Framer Motion).
Halaman kunci: login, dashboard per role, grid input nilai, absensi cepat, pratinjau rapor, dashboard yayasan.
9. Arsitektur Teknis
Backend: Laravel 11/12 (PHP 8.3), pola Controller → Action/Service → Model, Policy untuk otorisasi.
Frontend: Inertia + React + TypeScript, Vite, shadcn/ui, TanStack Table, React Hook Form + Zod, Recharts.
Multi-tenancy: satu database dengan school_id dan trait BelongsToSchool.
RBAC: spatie/laravel-permission (teams = school_id).
Infrastruktur: MySQL/PostgreSQL, Redis (cache/queue), Horizon, penyimpanan berkas S3-compatible.
Pendukung: spatie/laravel-activitylog, maatwebsite/excel, dompdf, spatie/laravel-backup, Sentry.
Kualitas: Pest, Larastan, Pint, ESLint, tsc, CI otomatis.
Entitas utama: foundations, schools, academic_years, semesters, users, teachers, students, guardians, classrooms, student_enrollments, subjects, subject_assignments, schedules, attendances, assessment_components, grades, report_cards, invoices, payments, announcements, activity_log.

10. Roadmap
Fase	Durasi	Hasil
0. Fondasi	2 minggu	Repo, design system, auth, role, multi-tenancy, layout
1. Master data	3 minggu	F-02, F-03, F-04
2. Akademik inti	4 minggu	F-05, F-06, F-07
3. Rapor	3 minggu	F-08
Pilot	2-4 minggu	Uji di 1-2 sekolah
4. Portal & yayasan	4 minggu	F-10, F-11
5. Keuangan	4 minggu	F-12
6. Notifikasi & PPDB	3 minggu	F-13, PPDB
7. Hardening & rilis	2 minggu	Uji beban, keamanan, migrasi data, pelatihan
11. Risiko & Mitigasi
Risiko	Dampak	Mitigasi
Kebocoran data antar sekolah	Tinggi	Global scope, Policy, tes isolasi otomatis
Kurikulum dan format rapor berbeda tiap sekolah	Sedang	Komponen nilai dan template rapor dapat dikonfigurasi
Resistensi pengguna (guru/TU)	Sedang	Pelatihan, UI sederhana, pilot bertahap
Kualitas data lama buruk saat migrasi	Sedang	Template impor, validasi, tahap dry-run
Lonjakan beban di akhir semester	Sedang	Queue untuk PDF, caching, uji beban
Cakupan membengkak	Tinggi	Batasi MVP, tinjau prioritas per fase
12. Asumsi & Pertanyaan Terbuka
Kurikulum yang dipakai (Merdeka, K13, atau campuran) perlu dipastikan untuk desain komponen nilai.
Jenjang yang dicakup (TK, SD, SMP, SMA/SMK, pesantren) menentukan struktur kelas dan rapor.
Kebutuhan integrasi Dapodik/EMIS: perlu atau tidak pada v1.
Pilihan payment gateway dan WhatsApp gateway.
Hosting: cloud atau server sendiri; kebijakan lokasi data.
Jumlah sekolah dan siswa pada peluncuran awal untuk perencanaan kapasitas.
13. Kriteria Penerimaan MVP
Admin yayasan dapat membuat sekolah baru dan admin sekolahnya.
Guru dapat mengisi absensi dan nilai hanya untuk kelas yang diampu.
Wali kelas dapat menghasilkan rapor PDF satu kelas dalam satu aksi batch.
Pengguna sekolah A tidak dapat mengakses data sekolah B (terbukti lewat tes otomatis).
Seluruh perubahan nilai tercatat di audit log.
Antarmuka responsif dan sesuai token desain putih-emerald.