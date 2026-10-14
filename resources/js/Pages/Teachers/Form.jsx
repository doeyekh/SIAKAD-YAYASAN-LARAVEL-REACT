import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function TeacherForm({ teacher, schools = [], activeSchoolId = null, isFoundation = false }) {
  const isEditing = !!teacher

  const { data, setData, post, put, processing, errors } = useForm({
    school_id: teacher?.school_id || activeSchoolId || '',
    nip: teacher?.nip || '',
    nuptk: teacher?.nuptk || '',
    full_name: teacher?.full_name || '',
    title_prefix: teacher?.title_prefix || '',
    title_suffix: teacher?.title_suffix || '',
    nik: teacher?.nik || '',
    jenis_guru: teacher?.jenis_guru || '',
    npwp: teacher?.npwp || '',
    foto: teacher?.foto || '',
    gender: teacher?.gender || 'L',
    phone: teacher?.phone || '',
    email: teacher?.email || '',
    is_active: teacher?.is_active ?? true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      put(`/teachers/${teacher.id}`)
    } else {
      post('/teachers')
    }
  }

  return (
    <AdminLayout activePath="teachers">
      <Head title={`${isEditing ? 'Edit Profil Guru' : 'Tambah Guru Baru'} - SIAKAD Al-Hikmah`} />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              {isEditing ? 'Ubah Profil Pendidik' : 'Pendaftaran Pendidik Baru'}
            </h1>
            <p className="text-xs text-slate-500">
              Lengkapi informasi identitas pendidik, NIP/NUPTK, dan kontak resmi
            </p>
          </div>
          <Link
            href="/teachers"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sekolah {isFoundation && <span className="text-rose-500">*</span>}
              </label>
              {isFoundation ? (
                <select
                  value={data.school_id}
                  onChange={(e) => setData('school_id', e.target.value)}
                  className={`w-full text-xs rounded-xl border ${errors.school_id ? 'border-rose-400' : 'border-slate-200'} px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="">Pilih sekolah</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name} ({school.educational_level})
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    value={`Sekolah ID ${data.school_id || activeSchoolId || '-'}`}
                    disabled
                    readOnly
                    className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
                  />
                  <input type="hidden" value={data.school_id || activeSchoolId || ''} />
                </>
              )}
              {errors.school_id && <p className="text-[11px] text-rose-500 mt-1">{errors.school_id}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                value={data.nip}
                onChange={(e) => setData('nip', e.target.value)}
                placeholder="198501102008011005"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NUPTK
              </label>
              <input
                type="text"
                value={data.nuptk}
                onChange={(e) => setData('nuptk', e.target.value)}
                placeholder="16 digit NUPTK"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
                placeholder="Nama lengkap tanpa gelar atau dengan gelar"
                className={`w-full text-xs rounded-xl border ${errors.full_name ? 'border-rose-400' : 'border-slate-200'} px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
              />
              {errors.full_name && <p className="text-[11px] text-rose-500 mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gelar Depan
              </label>
              <input
                type="text"
                value={data.title_prefix}
                onChange={(e) => setData('title_prefix', e.target.value)}
                placeholder="Contoh: Dra., Dr., H."
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gelar Belakang
              </label>
              <input
                type="text"
                value={data.title_suffix}
                onChange={(e) => setData('title_suffix', e.target.value)}
                placeholder="Contoh: S.Pd, M.Pd, M.Kom"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="guru@alhikmah.sch.id"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                value={data.nik}
                onChange={(e) => setData('nik', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Guru
              </label>
              <select
                value={data.jenis_guru}
                onChange={(e) => setData('jenis_guru', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Pilih jenis</option>
                <option value="tetap">Tetap</option>
                <option value="honorer">Honorer</option>
                <option value="pns">PNS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NPWP
              </label>
              <input
                type="text"
                value={data.npwp}
                onChange={(e) => setData('npwp', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Kepegawaian
              </label>
              <select
                value={data.is_active ? '1' : '0'}
                onChange={(e) => setData('is_active', e.target.value === '1')}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1">Aktif Mengajar</option>
                <option value="0">Cuti / Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/teachers"
              className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambahkan Guru')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

