import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function ClassroomsIndex({ classrooms, teachers, academicYears }) {
  const [showModal, setShowModal] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState(null)

  const { data, setData, post, put, reset, processing, errors } = useForm({
    name: '',
    grade_level: '10',
    homeroom_teacher_id: '',
    academic_year_id: academicYears[0]?.id || '',
  })

  const openCreateModal = () => {
    reset()
    setEditingClassroom(null)
    setShowModal(true)
  }

  const openEditModal = (c) => {
    setEditingClassroom(c)
    setData({
      name: c.name,
      grade_level: c.grade_level,
      homeroom_teacher_id: c.homeroom_teacher_id || '',
      academic_year_id: academicYears[0]?.id || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingClassroom) {
      put(`/classrooms/${editingClassroom.id}`, {
        onSuccess: () => setShowModal(false),
      })
    } else {
      post('/classrooms', {
        onSuccess: () => {
          reset()
          setShowModal(false)
        },
      })
    }
  }

  const handleDelete = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus rombel ${name}?`)) {
      router.delete(`/classrooms/${id}`)
    }
  }

  return (
    <AdminLayout activePath="classrooms">
      <Head title="Rombongan Belajar (Kelas) - SIAKAD Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Rombongan Belajar &amp; Penetapan Wali Kelas
          </h1>
          <p className="text-xs text-slate-500">
            Kelola struktur rombel per tingkat jenjang, penetapan wali kelas, dan kuota siswa
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Rombel Baru
        </button>
      </div>

      {/* Grid of Classrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-5 flex flex-col justify-between hover:border-emerald-200 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs">
                  Tingkat {c.grade_level}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {c.academic_year}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  {c.name}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                  <span className="material-symbols-outlined text-sm text-emerald-600">shield_person</span>
                  <span className="font-medium truncate">{c.homeroom_teacher_name}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] flex items-center justify-between text-xs">
                <span className="text-slate-500">Siswa Terdaftar</span>
                <span className="font-bold text-slate-800">{c.students_count} Siswa</span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(c)}
                className="px-3 py-1 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit / Wali Kelas
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id, c.name)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus Kelas"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {editingClassroom ? 'Ubah Rombel & Wali Kelas' : 'Tambah Rombongan Belajar'}
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
                  Nama Rombongan Belajar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: X MIPA 1, VII A"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tingkat / Jenjang Kelas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 10, 11, 12, atau 7, 8, 9"
                  value={data.grade_level}
                  onChange={(e) => setData('grade_level', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.grade_level && <p className="text-rose-500 mt-1">{errors.grade_level}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wali Kelas
                </label>
                <select
                  value={data.homeroom_teacher_id}
                  onChange={(e) => setData('homeroom_teacher_id', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Belum Ada Wali Kelas</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
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
                  {processing ? 'Menyimpan...' : 'Simpan Rombel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

