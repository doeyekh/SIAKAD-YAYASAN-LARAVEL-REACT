import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/Admin/AdminLayout'

export default function SchoolsIndex({ schools, filters }) {
  const [search, setSearch] = useState(filters.search || '')

  const handleFilter = (e) => {
    e.preventDefault()
    router.get('/foundation/schools', { search }, { preserveState: true })
  }

  const handleDelete = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data sekolah ${name}? Perhatian: Seluruh data akademik bertenant akan terpengaruh.`)) {
      router.delete(`/foundation/schools/${id}`)
    }
  }

  return (
    <AdminLayout activePath="foundation-schools">
      <Head title="Manajemen Satuan Sekolah - Yayasan Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Manajemen Satuan Pendidikan (Sekolah)
          </h1>
          <p className="text-xs text-slate-500">
            Daftarkan sekolah baru di bawah yayasan, kelola NPSN, jenjang pendidikan, dan admin sekolah
          </p>
        </div>
        <Link
          href="/foundation/schools/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add_business</span>
          Tambah Sekolah Baru
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EBE8] shadow-sm">
        <form onSubmit={handleFilter} className="flex gap-3">
          <input
            type="text"
            placeholder="Cari nama sekolah, NPSN, atau jenjang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Grid of School Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">domain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                    Jenjang {school.educational_level}
                  </span>
                  {school.is_active ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Aktif" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" title="Nonaktif" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans'] leading-snug">
                  {school.name}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  NPSN: {school.npsn}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {school.address}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Siswa</span>
                  <span className="font-bold text-slate-800">{school.students_count}</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Guru</span>
                  <span className="font-bold text-slate-800">{school.teachers_count}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rombel</span>
                  <span className="font-bold text-slate-800">{school.classrooms_count}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-slate-400">mail</span>
                  <span className="truncate">{school.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-slate-400">call</span>
                  <span>{school.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <Link
                href={`/foundation/schools/${school.id}/edit`}
                className="px-3 py-1 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Unit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(school.id, school.name)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus Sekolah"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

