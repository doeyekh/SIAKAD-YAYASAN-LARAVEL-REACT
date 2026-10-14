# SIAKAD Multi-Sekolah Yayasan

SIAKAD adalah aplikasi web akademik terpusat untuk yayasan pendidikan yang menaungi banyak sekolah. Setiap sekolah mengelola data akademiknya sendiri, sedangkan yayasan dapat melihat data konsolidasi lintas sekolah.

## Stack Teknologi

- Backend: Laravel 13, PHP 8.3
- Frontend: Inertia.js v3, React 19, Vite, Tailwind CSS v4
- Database development: SQLite
- Database production disarankan: MySQL/PostgreSQL
- Export/import Excel: Maatwebsite Excel

## Fitur Saat Ini

- Autentikasi, logout, dan rate limiting login.
- Context switching school/role setelah login.
- Multi-tenancy berbasis `school_id` dengan global scope.
- Management sekolah, tahun ajaran, semester, kelas, mata pelajaran.
- Kesiswaan: siswa, orang tua/wali, penempatan kelas.
- Kepegawaian: profil guru dengan NIP, NUPTK, NIK terenkripsi, jenis guru, NPWP, kontak, status.
- Import data guru dari Excel lewat modal di halaman `/teachers`.
- Dashboard per role dan dashboard yayasan.
- Audit trail untuk perubahan data.
- Policy authorization dan test isolasi tenant.

## Menjalankan Project

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Siapkan environment

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Migrasi database

```bash
php artisan migrate:fresh --seed
```

### 4. Build asset frontend

```bash
npm run build
```

Untuk pengembangan frontend:

```bash
npm run dev
```

### 5. Jalankan aplikasi

```bash
php artisan serve
```

Akses: `http://127.0.0.1:8000`

Alternatif:

```bash
composer run dev
```

## Akun Demo Seeder

Password default semua akun seeder: `password`

- Super Admin: `superadmin@alhikmah.sch.id`
- Admin Yayasan: `admin.yayasan@alhikmah.sch.id`
- Admin SMA: `admin.sma@alhikmah.sch.id`
- Guru SMA: `guru.sma@alhikmah.sch.id`
- Admin SMP: `admin.smp@alhikmah.sch.id`

## Testing

```bash
php artisan test --compact
```

Target saat ini: 22 tests, 69 assertions, semua pass.

Format PHP:

```bash
vendor/bin/pint --format agent
```

## Route Penting

- `/login` — login
- `/` — dashboard
- `/foundation/schools` — manajemen sekolah
- `/foundation/academic-years` — tahun ajaran dan semester
- `/students` — data siswa
- `/teachers` — data guru dan import Excel
- `/classrooms` — kelas
- `/subjects` — mata pelajaran

## Struktur Project

- `app/Models` — model Eloquent dan tenant scoping
- `app/Http/Controllers` — controller
- `app/Policies` — policy authorization
- `database/migrations` — schema database
- `database/seeders` — data demo
- `resources/js/Pages` — halaman Inertia React
- `resources/js/Layouts` — layout admin
- `tests/Feature` — feature tests

## Catatan Pengembangan

- Test memakai SQLite in-memory.
- Gunakan MySQL/PostgreSQL untuk produksi.
- Kolom sensitif seperti NIK guru dienkripsi menggunakan Laravel cast `encrypted`.
- Route `/teachers/import` menerima file `.xlsx`, `.xls`, dan `.csv`.
