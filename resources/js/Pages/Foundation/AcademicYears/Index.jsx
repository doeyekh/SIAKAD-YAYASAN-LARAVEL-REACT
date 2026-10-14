import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/Admin/AdminLayout'

export default function AcademicYearsIndex({ academicYears, schools, selectedSchoolId }) {
  const [showModal, setShowModal] = useState(false)

  const { data, setData, post, reset, processing, errors } = useForm({
    school_id: selectedSchoolId || schools[0]?.id || '',
    name: '',
    start_date: '',
    end_date: '',
    is_active: false,
    active_semester: 'ganjil',
  })

  const handleSelectSchool = (schoolId) => {
    router.get('/foundation/academic-years', { school_id: schoolId }, { preserveState: true })
  }

  const handleActivate = (id) => {
    if (confirm('Jadikan tahun ajaran ini sebagai tahun ajaran aktif? Tahun ajaran lain di unit ini akan dinonaktifkan.')) {
      router.post(`/foundation/academic-years/${id}/activate`)
    }
  }

  const handleToggleSemester = (ayId, semester) => {
    router.post(`/foundation/academic-years/${ayId}/semesters/${semester}/activate`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/foundation/academic-years', {
      onSuccess: () => {
        reset()
        setShowModal(false)
      },
    })
  }

  return (
    <AdminLayout activePath="foundation-academic-years">
      <Head title="Manajemen Tahun Ajaran & Semester - Yayasan Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Tahun Ajaran &amp; Semester Akademik
          </h1>
          <p className="text-xs text-slate-500">
            Atur kalender tahun ajaran dan semester aktif untuk seluruh satuan pendidikan yayasan
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setData('school_id', selectedSchoolId)
            setShowModal(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">calendar_add_on</span>
          Tambah Tahun Ajaran
        </button>
      </div>

      {/* School Unit Filter Tab */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {schools.map((school) => {
          const isSelected = selectedSchoolId === school.id
          return (
            <button
              key={school.id}
              type="button"
              onClick={() => handleSelectSchool(school.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-[#E5EBE8] text-slate-700 hover:bg-slate-50'
              }`}
            >
              {school.name} ({school.educational_level})
            </button>
          )
        })}
      </div>

      {/* List of Academic Years */}
      <div className="space-y-4">
        {academicYears.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5EBE8] p-8 text-center text-slate-400 text-xs">
            Belum ada data tahun ajaran di satuan sekolah ini. Silakan buat tahun ajaran baru.
          </div>
        ) : (
          academicYears.map((ay) => (
            <div
              key={ay.id}
              className={`bg-white rounded-2xl border p-5 transition-colors shadow-sm ${
                ay.is_active ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#E5EBE8]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      Tahun Ajaran {ay.name}
                    </h3>
                    {ay.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Tahun Ajaran Aktif
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
                        Arsip
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Periode: {ay.start_date} s/d {ay.end_date}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Semester Switches */}
                  <div className="p-1 rounded-xl bg-slate-100 flex items-center gap-1 text-xs">
                    {ay.semesters.map((sem) => (
                      <button
                        key={sem.id}
                        type="button"
                        onClick={() => handleToggleSemester(ay.id, sem.semester)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          sem.is_active
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Semester {sem.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                        {sem.is_active && ' (Aktif)'}
                      </button>
                    ))}
                  </div>

                  {!ay.is_active && (
                    <button
                      type="button"
                      onClick={() => handleActivate(ay.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors"
                    >
                      Aktifkan Tahun Ajaran
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Tahun Ajaran */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Tambah Tahun Ajaran Baru
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
                  Satuan Sekolah
                </label>
                <select
                  value={data.school_id}
                  onChange={(e) => setData('school_id', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.educational_level})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Tahun Ajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2027/2028"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.start_date && <p className="text-rose-500 mt-1">{errors.start_date}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.end_date && <p className="text-rose-500 mt-1">{errors.end_date}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Semester Awal yang Diaktifkan
                </label>
                <select
                  value={data.active_semester}
                  onChange={(e) => setData('active_semester', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ganjil">Semester Ganjil</option>
                  <option value="genap">Semester Genap</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="modal_is_active"
                  type="checkbox"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="modal_is_active" className="text-slate-700 font-medium">
                  Langsung jadikan Tahun Ajaran Aktif
                </label>
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
                  {processing ? 'Menyimpan...' : 'Simpan Tahun Ajaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

