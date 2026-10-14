import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/Admin/AdminLayout'

export default function SchoolForm({ school }) {
  const isEditing = !!school

  const { data, setData, post, put, processing, errors } = useForm({
    name: school?.name || '',
    npsn: school?.npsn || '',
    educational_level: school?.educational_level || 'SMA',
    email: school?.email || '',
    phone: school?.phone || '',
    address: school?.address || '',
    is_active: school?.is_active ?? true,

    // Initial school admin account fields (only when creating)
    admin_name: '',
    admin_email: '',
    admin_password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      put(`/foundation/schools/${school.id}`)
    } else {
      post('/foundation/schools')
    }
  }

  return (
    <AdminLayout activePath="foundation-schools">
      <Head title={`${isEditing ? 'Ubah Informasi Satuan Sekolah' : 'Pendaftaran Satuan Sekolah Baru'} - Yayasan Al-Hikmah`} />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              {isEditing ? 'Ubah Satuan Pendidikan' : 'Daftarkan Satuan Pendidikan Baru'}
            </h1>
            <p className="text-xs text-slate-500">
              Lengkapi identitas sekolah resmi, NPSN Kemendikbud, jenjang, dan administrator unit
            </p>
          </div>
          <Link
            href="/foundation/schools"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6 space-y-6">
          {/* Section 1: Data Satuan Pendidikan */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2">
              1. Identitas Satuan Sekolah
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Satuan Pendidikan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Contoh: SMA Plus Al-Hikmah 1, SMP Al-Hikmah"
                  className={`w-full text-xs rounded-xl border ${errors.name ? 'border-rose-400' : 'border-slate-200'} px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                />
                {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Pokok Sekolah Nasional (NPSN) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.npsn}
                  onChange={(e) => setData('npsn', e.target.value)}
                  placeholder="8 Digit NPSN (Contoh: 20104561)"
                  className={`w-full text-xs rounded-xl border ${errors.npsn ? 'border-rose-400' : 'border-slate-200'} px-3 py-2 font-mono focus:ring-2 focus:ring-emerald-500`}
                />
                {errors.npsn && <p className="text-rose-500 text-[11px] mt-1">{errors.npsn}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenjang Pendidikan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={data.educational_level}
                  onChange={(e) => setData('educational_level', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="TK">TK (Taman Kanak-Kanak / PAUD)</option>
                  <option value="SD">SD (Sekolah Dasar / MI)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama / MTs)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas / MA)</option>
                  <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Resmi Sekolah
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="sekolah@alhikmah.sch.id"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telepon Kantor
                </label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="022-723xxxx"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Unit Sekolah
                </label>
                <textarea
                  rows="2"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Jalan, kelurahan, kecamatan, kota/kabupaten"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Operasional
                </label>
                <select
                  value={data.is_active ? '1' : '0'}
                  onChange={(e) => setData('is_active', e.target.value === '1')}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="1">Aktif Beroperasi</option>
                  <option value="0">Nonaktif / Ditangguhkan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pembuatan Admin Sekolah Pertama (Hanya saat pendaftaran sekolah baru) */}
          {!isEditing && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  2. Akun Administrator Unit Sekolah (Opsional)
                </h2>
                <span className="text-[11px] text-slate-400">PRD MVP Kriteria 1</span>
              </div>
              <p className="text-xs text-slate-500">
                Yayasan dapat langsung menunjuk staf TU/Admin yang bertugas mengelola data sekolah baru ini.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Petugas Admin / TU
                  </label>
                  <input
                    type="text"
                    value={data.admin_name}
                    onChange={(e) => setData('admin_name', e.target.value)}
                    placeholder="Nama lengkap admin sekolah"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.admin_name && <p className="text-rose-500 text-[11px] mt-1">{errors.admin_name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Login Admin
                  </label>
                  <input
                    type="email"
                    value={data.admin_email}
                    onChange={(e) => setData('admin_email', e.target.value)}
                    placeholder="admin.unit@alhikmah.sch.id"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.admin_email && <p className="text-rose-500 text-[11px] mt-1">{errors.admin_email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Awal
                  </label>
                  <input
                    type="password"
                    value={data.admin_password}
                    onChange={(e) => setData('admin_password', e.target.value)}
                    placeholder="Default: password"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.admin_password && <p className="text-rose-500 text-[11px] mt-1">{errors.admin_password}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/foundation/schools"
              className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Daftarkan Satuan Sekolah')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

