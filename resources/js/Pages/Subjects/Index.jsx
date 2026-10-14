import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function SubjectsIndex({ subjects }) {
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)

  const { data, setData, post, put, reset, processing, errors } = useForm({
    code: '',
    name: '',
    grade_level: '',
    kkm: 75,
  })

  const openCreateModal = () => {
    reset()
    setEditingSubject(null)
    setShowModal(true)
  }

  const openEditModal = (sub) => {
    setEditingSubject(sub)
    setData({
      code: sub.code,
      name: sub.name,
      grade_level: sub.grade_level === 'Semua Tingkat' ? '' : sub.grade_level,
      kkm: sub.kkm,
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSubject) {
      put(`/subjects/${editingSubject.id}`, {
        onSuccess: () => setShowModal(false),
      })
    } else {
      post('/subjects', {
        onSuccess: () => {
          reset()
          setShowModal(false)
        },
      })
    }
  }

  const handleDelete = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran ${name}?`)) {
      router.delete(`/subjects/${id}`)
    }
  }

  return (
    <AdminLayout activePath="subjects">
      <Head title="Mata Pelajaran & KKM - SIAKAD Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Mata Pelajaran &amp; Standar KKM
          </h1>
          <p className="text-xs text-slate-500">
            Daftar kurikulum mata pelajaran dan kriteria ketuntasan minimal (KKM) per jenjang
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Mapel Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F8FAF9] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Kode Mapel</th>
                <th className="py-3 px-4">Nama Mata Pelajaran</th>
                <th className="py-3 px-4">Jenjang / Tingkat</th>
                <th className="py-3 px-4">Nilai KKM</th>
                <th className="py-3 px-4">Pendidik Pengampu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Belum ada mata pelajaran terdaftar.
                  </td>
                </tr>
              ) : (
                subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                      {sub.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {sub.grade_level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold font-mono">
                        {sub.kkm}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sub.teachers_count} Guru Ditugaskan
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(sub)}
                          className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Mapel"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id, sub.name)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Mapel"
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
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {editingSubject ? 'Ubah Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode Mapel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BIO-10, MTK-07"
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                />
                {errors.code && <p className="text-rose-500 mt-1">{errors.code}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biologi, Matematika Peminatan"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tingkat Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 10 atau kosongkan"
                    value={data.grade_level}
                    onChange={(e) => setData('grade_level', e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Standar KKM <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    value={data.kkm}
                    onChange={(e) => setData('kkm', e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.kkm && <p className="text-rose-500 mt-1">{errors.kkm}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : 'Simpan Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
