import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function StudentsIndex({ students, filters, classrooms }) {
  const [search, setSearch] = useState(filters.search || '')
  const [status, setStatus] = useState(filters.status || '')
  const [classroomId, setClassroomId] = useState(filters.classroom_id || '')

  const handleFilter = (e) => {
    e.preventDefault()
    router.get('/students', { search, status, classroom_id: classroomId }, { preserveState: true })
  }

  const handleDelete = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa ${name}?`)) {
      router.delete(`/students/${id}`)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px]">Aktif</span>
      case 'transferred_in':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium text-[11px]">Pindahan Masuk</span>
      case 'transferred_out':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium text-[11px]">Mutasi Keluar</span>
      case 'graduated':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">Lulus</span>
      default:
        return status
    }
  }

  return (
    <AdminLayout activePath="students">
      <Head title="Direktori Siswa - SIAKAD Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Direktori &amp; Mutasi Siswa
          </h1>
          <p className="text-xs text-slate-500">
            Kelola data peserta didik, mutasi, penempatan kelas, dan orang tua/wali
          </p>
        </div>
        <Link
          href="/students/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Siswa Baru
        </Link>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EBE8] shadow-sm">
        <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Semua Status Siswa</option>
              <option value="active">Aktif</option>
              <option value="transferred_in">Pindahan Masuk</option>
              <option value="transferred_out">Mutasi Keluar</option>
              <option value="graduated">Lulus</option>
            </select>
          </div>
          <div className="flex gap-2">
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Semua Kelas</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-xl transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F8FAF9] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">NISN / NIS</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Wali &amp; Kontak</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Tidak ada data siswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                students.data.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      <div>{student.nisn}</div>
                      {student.nis && <div className="text-[10px] text-slate-400">{student.nis}</div>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student.full_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.gender}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-medium text-slate-700">
                        {student.current_class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{student.guardian_name}</div>
                      <div className="text-[10px] text-slate-400">{student.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/students/${student.id}/edit`}
                          className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Siswa"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(student.id, student.full_name)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Siswa"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {students.links && students.links.length > 3 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Menampilkan {students.from || 0} - {students.to || 0} dari {students.total} siswa
            </span>
            <div className="flex gap-1">
              {students.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    link.active
                      ? 'bg-emerald-600 text-white'
                      : link.url
                      ? 'hover:bg-slate-100 text-slate-600'
                      : 'text-slate-300 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

