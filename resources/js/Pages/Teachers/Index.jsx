import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function TeachersIndex({ teachers, filters, schools = [], activeSchoolId = null, isFoundation = false }) {
  const [search, setSearch] = useState(filters.search || '')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importSchool, setImportSchool] = useState(activeSchoolId || '')
  const [importing, setImporting] = useState(false)

  const handleFilter = (e) => {
    e.preventDefault()
    router.get('/teachers', { search }, { preserveState: true })
  }

  const handleDelete = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pendidik ${name}?`)) {
      router.delete(`/teachers/${id}`)
    }
  }

  const closeImportModal = () => {
    setShowImportModal(false)
    setImportFile(null)
    setImportSchool(activeSchoolId || '')
  }

  const handleImport = (e) => {
    e.preventDefault()
    if (!importFile) return

    setImporting(true)
    const formData = new FormData()
    formData.append('file', importFile)
    if (isFoundation && importSchool) {
      formData.append('school_id', importSchool)
    }

    router.post('/teachers/import', formData, {
      forceFormData: true,
      preserveScroll: true,
      onFinish: () => {
        setImporting(false)
        closeImportModal()
      },
    })
  }

  return (
    <AdminLayout activePath="teachers">
      <Head title="Direktori Pendidik & Tendik - SIAKAD Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Direktori Guru &amp; Tenaga Kependidikan
          </h1>
          <p className="text-xs text-slate-500">
            Kelola profil pendidik, NIP/NUPTK, penetapan wali kelas, dan pembagian tugas mengajar
          </p>
        </div>
        {isFoundation && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Import Excel
            </button>
            <Link
              href="/teachers/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Tambah Guru Baru
            </Link>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EBE8] shadow-sm">
        <form onSubmit={handleFilter} className="flex gap-3">
          <input
            type="text"
            placeholder="Cari nama guru, NIP, atau NUPTK..."
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F8FAF9] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Nama Lengkap &amp; Gelar</th>
                <th className="py-3 px-4">NIP / NUPTK</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Tidak ada data pendidik yang ditemukan.
                  </td>
                </tr>
              ) : (
                teachers.data.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {teacher.full_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div>{teacher.nip}</div>
                      {teacher.nuptk !== '-' && <div className="text-[10px] text-slate-400">{teacher.nuptk}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {teacher.gender}
                    </td>
                    <td className="py-3 px-4">
                      {teacher.homeroom_class ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px] inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-emerald-600">shield_person</span>
                          Wali {teacher.homeroom_class}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{teacher.phone}</div>
                      <div className="text-[10px] text-slate-400">{teacher.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {teacher.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium">Aktif</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">Nonaktif</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/teachers/${teacher.id}/edit`}
                          className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Guru"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(teacher.id, teacher.full_name)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Guru"
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
        {teachers.links && teachers.links.length > 3 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Menampilkan {teachers.from || 0} - {teachers.to || 0} dari {teachers.total} pendidik
            </span>
            <div className="flex gap-1">
              {teachers.links.map((link, idx) => (
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-[#E5EBE8]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Import Guru dari Excel</h2>
                <p className="text-xs text-slate-500 mt-1">Unggah file .xlsx, .xls, atau .csv.</p>
              </div>
              <button type="button" onClick={closeImportModal} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleImport} className="p-5 space-y-4">
              {isFoundation && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sekolah tujuan</label>
                  <select
                    value={importSchool}
                    onChange={(e) => setImportSchool(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white"
                  >
                    <option value="">Pilih sekolah tujuan</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">File Excel</label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Kolom: full_name/nama_lengkap, nip, nuptk, nik, gender/jenis_kelamin, title_prefix/gelar_depan, title_suffix/gelar_belakang, jenis_guru, npwp, phone/telepon, email, is_active/aktif.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeImportModal} className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={importing || !importFile}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm disabled:opacity-50"
                >
                  {importing ? 'Mengimpor...' : 'Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
