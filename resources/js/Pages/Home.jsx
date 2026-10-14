import React from 'react'
import { Head, usePage } from '@inertiajs/react'
import AdminLayout from '../Layouts/Admin/AdminLayout'

export default function Home({ stats, isFoundationView, schoolsSummary = [], recentLogs = [] }) {
  const { auth } = usePage().props
  const user = auth?.user
  const activeSchool = auth?.active_school
  const activeRole = auth?.active_role

  const getRoleTitle = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin Sistem'
      case 'foundation_admin': return 'Administrator Yayasan'
      case 'principal': return 'Kepala Sekolah'
      case 'school_admin': return 'Staf Tata Usaha / Admin Sekolah'
      case 'teacher': return 'Guru Pengampu'
      case 'homeroom_teacher': return 'Wali Kelas'
      default: return 'Pengguna'
    }
  }

  return (
    <AdminLayout activePath="dashboard">
      <Head title={`${isFoundationView ? 'Dashboard Yayasan' : (activeSchool?.name || 'Dashboard')} - SIAKAD Al-Hikmah`} />

      {/* Header Banner */}
      <div className="relative bg-white rounded-2xl p-6 lg:p-8 border border-[#E5EBE8] shadow-sm overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistem Operasional Aktif
              </span>
              <span className="text-slate-500 text-xs flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">event_note</span>
                {stats?.active_academic_year ? `T.A. ${stats.active_academic_year} Ganjil` : 'T.A. 2026/2027 Ganjil'}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                Multi-Tenancy Terisolasi
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
              Selamat Datang, {user?.name || 'Administrator'}
            </h1>
            <p className="text-sm text-slate-500">
              {getRoleTitle(activeRole)} • {isFoundationView ? 'Konsol Pusat Pengawasan Seluruh Unit Yayasan Al-Hikmah' : (activeSchool?.name || 'SIAKAD')}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isFoundationView ? (
          <>
            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unit Sekolah</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">domain</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_schools || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Sekolah binaan yayasan aktif</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Siswa Yayasan</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">groups</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_students || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Total seluruh peserta didik</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Pendidik</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">badge</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_teachers || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Guru di seluruh unit sekolah</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rombel Aktif</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">meeting_room</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_classrooms || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Rombongan belajar terdaftar</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Peserta Didik</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">school</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_students || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Siswa aktif di unit ini</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dewan Guru</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">badge</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_teachers || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Guru pengampu &amp; wali kelas</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rombongan Belajar</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">door_front</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {stats?.total_classrooms || 0}
              </div>
              <p className="mt-1 text-xs text-slate-400">Kelas tahun ajaran aktif</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE8] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Presensi Hari Ini</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">how_to_reg</span>
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                98.4%
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-medium">Rekap harian berjalan lancar</p>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      {isFoundationView ? (
        /* Consolidated Foundation Comparison View */
        <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Ringkasan Konsolidasi Satuan Pendidikan (Yayasan)
              </h2>
              <p className="text-xs text-slate-500">
                Perbandingan data real-time antar sekolah di bawah naungan Yayasan Pendidikan Al-Hikmah
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Nama Satuan Sekolah</th>
                  <th className="py-3 px-4">Jenjang</th>
                  <th className="py-3 px-4 text-right">Jumlah Siswa</th>
                  <th className="py-3 px-4 text-right">Dewan Guru</th>
                  <th className="py-3 px-4 text-right">Rombel Kelas</th>
                  <th className="py-3 px-4 text-center">Status Isolasi Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolsSummary.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {school.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                        {school.educational_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {school.students_count} Siswa
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {school.teachers_count} Guru
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {school.classrooms_count} Kelas
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Terpisah (school_id={school.id})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* School Level Audit Logs & Approvals */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Audit Trail &amp; Log Perubahan (Kriteria PRD 5)
                </h2>
                <p className="text-xs text-slate-500">
                  Pencatatan otomatis seluruh riwayat mutasi, data nilai, dan kesiswaan
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                Real-time
              </span>
            </div>

            {recentLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Belum ada aktivitas mutasi data yang tercatat hari ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-base">history_edu</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {log.action.toUpperCase()} {log.type}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Oleh {log.user_name} • {log.created_at}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px]">
                      Tercatat
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans'] mb-1">
              Informasi Satuan Pendidikan
            </h2>
            <p className="text-xs text-slate-500 mb-4">Detail unit sekolah aktif</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8]">
                <div className="text-slate-400 text-[10px] uppercase font-bold">NPSN</div>
                <div className="font-semibold text-slate-800">{activeSchool?.npsn || '-'}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8]">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Jenjang Pendidikan</div>
                <div className="font-semibold text-slate-800">{activeSchool?.educational_level || '-'}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8]">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Status Isolasi Data Tenant</div>
                <div className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  school_id = {activeSchool?.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}