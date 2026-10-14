# TODO — SIAKAD Multi-Sekolah

## Phase 0 — Stabilisasi (Selesai)
- [x] Perbaiki migrasi `teachers` agar `school_id` tetap dipertahankan.
- [x] Sinkronkan `app/Models/Teacher.php` dengan kolom profil baru.
- [x] Ubah relasi `School::teachers()` menjadi `HasMany`.
- [x] Tambah validasi profil guru di `StoreTeacherRequest` dan `UpdateTeacherRequest`.
- [x] Tambah guard role pada endpoint school dan academic year.
- [x] Tambah index performa tenant (`students`, `teachers`, `classrooms`).
- [x] Refresh database development dengan `migrate:fresh --seed`.
- [x] Rebuild asset frontend (`npm run build`).
- [x] Verifikasi `php artisan test --compact`: 20 passed, 65 assertions.

## Phase 1 — Hardening (Selesai sebagian)
- [x] Buat Policy untuk `Student`, `Teacher`, `Classroom`, `Subject`, dan `School`.
- [x] Daftarkan policy di `AppServiceProvider`.
- [x] Aktifkan `authorizeResource` di controller master data.
- [x] Perbaiki base Controller agar mendukung `authorizeResource`.
- [x] Tambah test akses ID langsung antar sekolah (403/404).
- [x] Enkripsi kolom `teachers.nik` dengan cast `encrypted`.
- [ ] Tambahkan kebijakan retensi audit log sesuai UU PDP.
- [ ] Tambahkan cache untuk dashboard/yayasan bila perlu.
- [ ] Review lanjutan N+1 dan optimasi query dashboard.

## Phase 1.6 — Penyesuaian PRD Akun Guru (Selesai sebagian)
## Phase 1.7 — Manajemen Role (Selesai)
- [x] Buat controller `RoleManagementController`.
- [x] Buat route `/foundation/role-assignments`.
- [x] Buat halaman Index dan Form role assignment.
- [x] Tambah menu sidebar `Role & Penugasan`.
- [x] Tambah seeder `RoleManagementSeeder` untuk akun demo bendahara.
- [x] Verifikasi akses super admin dan admin yayasan.
- [x] Tambah `teacher_id` pada tabel `users`.
- [x] Tambah `academic_year_id` pada tabel `school_users`.
- [x] `User` memiliki relasi `teacher`.
- [x] `SchoolUser` memiliki relasi `academicYear`.
- [x] Pembuatan guru mengisi `users.teacher_id`.
- [x] Penugasan guru mengisi `school_users.academic_year_id`.
- [ ] Lepas keterikatan langsung `teachers.school_id` bila teacher multi-sekolah final diimplementasikan.
- [ ] Refactor seeder update `academic_year_id` untuk semua role SMP.

## Phase 1.5 — Modul Guru (Selesai sebagian)
- [x] Perbaiki halaman `/teachers` dan controller guru.
- [x] Form tambah/edit guru dengan field profil, NIK terenkripsi, jenis guru, NPWP.
- [x] School ID otomatis/read-only untuk role sekolah dan dropdown untuk role yayasan.
- [x] Tambah/hapus guru dengan otorisasi policy tenant.
- [x] Import guru dari Excel menggunakan Laravel Excel/maatwebsite.
- [ ] Tambah template unduh Excel contoh.
- [ ] Tambah progress/error report hasil import per baris.

## Phase 2 — Akademik Inti (MVP Lanjutan)
- [ ] Jadwal pelajaran dan deteksi bentrok guru/ruang.
- [ ] Absensi harian/per mata pelajaran.
- [ ] Komponen nilai berbobot, KKM, dan grid input nilai.
- [ ] Generate rapor PDF per siswa dan batch per kelas.
- [ ] Alur approval rapor: draft → wali kelas → kepala sekolah → publikasi.
- [ ] Import/export Excel untuk master data.

## Phase 3 — Skala dan Operasional
- [ ] Konfigurasi Redis + queue untuk PDF dan import massal.
- [ ] Penyimpanan file S3-compatible untuk foto dan PDF.
- [ ] Backup terenkripsi dan uji restore.
- [ ] Integrasi Sentry dan monitoring error.
- [ ] Load test skenario akhir semester.
- [ ] Audit keamanan dan isolasi data.

## Catatan
- Testing utama menggunakan SQLite in-memory.
- Produksi disarankan MySQL/PostgreSQL.
- Teacher saat ini berada pada model single-school (sesuai test aktif).
