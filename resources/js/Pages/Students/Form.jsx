import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function StudentForm({ student, classrooms }) {
  const isEditing = !!student

  const { data, setData, post, put, processing, errors } = useForm({
    nisn: student?.nisn || '',
    nis: student?.nis || '',
    full_name: student?.full_name || '',
    gender: student?.gender || 'L',
    birth_place: student?.birth_place || '',
    birth_date: student?.birth_date || '',
    religion: student?.religion || 'Islam',
    address: student?.address || '',
    status: student?.status || 'active',
    classroom_id: student?.classroom_id || '',
    guardian_name: student?.guardian_name || '',
    guardian_relationship: student?.guardian_relationship || 'ayah',
    guardian_phone: student?.guardian_phone || '',
    guardian_occupation: student?.guardian_occupation || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      put(`/students/${student.id}`)
    } else {
      post('/students')
    }
  }

  return (
    <AdminLayout activePath="students">
      <Head title={`${isEditing ? 'Edit Data Siswa' : 'Tambah Siswa Baru'} - SIAKAD Al-Hikmah`} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              {isEditing ? 'Ubah Data Siswa' : 'Pendaftaran Siswa Baru'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditing ? `Perbarui profil, data wali, dan status mutasi untuk ${student.full_name}` : 'Lengkapi informasi identitas, kelas, dan orang tua/wali'}
            </p>
          </div>
          <Link
            href="/students"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Kembali
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6 space-y-6">
          {/* Section 1: Data Identitas Siswa */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2">
              1. Identitas Pokok Peserta Didik
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NISN <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.nisn}
                  onChange={(e) => setData('nisn', e.target.value)}
                  placeholder="Contoh: 0078491290"
                  className={`w-full text-xs rounded-xl border ${errors.nisn ? 'border-rose-400' : 'border-slate-200'} px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                />
                {errors.nisn && <p className="text-[11px] text-rose-500 mt-1">{errors.nisn}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIS (Nomor Induk Sekolah)
                </label>
                <input
                  type="text"
                  value={data.nis}
                  onChange={(e) => setData('nis', e.target.value)}
                  placeholder="Contoh: 262710001"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.nis && <p className="text-[11px] text-rose-500 mt-1">{errors.nis}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.full_name}
                  onChange={(e) => setData('full_name', e.target.value)}
                  placeholder="Nama sesuai akta kelahiran / ijazah"
                  className={`w-full text-xs rounded-xl border ${errors.full_name ? 'border-rose-400' : 'border-slate-200'} px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                />
                {errors.full_name && <p className="text-[11px] text-rose-500 mt-1">{errors.full_name}</p>}
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
                  Agama
                </label>
                <select
                  value={data.religion}
                  onChange={(e) => setData('religion', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  value={data.birth_place}
                  onChange={(e) => setData('birth_place', e.target.value)}
                  placeholder="Kota/Kabupaten"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={data.birth_date}
                  onChange={(e) => setData('birth_date', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Siswa
                </label>
                <textarea
                  rows="2"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Nama jalan, RT/RW, kelurahan, kecamatan"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Penempatan Kelas & Status */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2">
              2. Status &amp; Penempatan Rombel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rombongan Belajar (Kelas)
                </label>
                <select
                  value={data.classroom_id}
                  onChange={(e) => setData('classroom_id', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Belum Ditempatkan ke Kelas</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} (Tingkat {c.grade_level})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Akademik Siswa <span className="text-rose-500">*</span>
                </label>
                <select
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Aktif</option>
                  <option value="transferred_in">Pindahan Masuk</option>
                  <option value="transferred_out">Mutasi Keluar</option>
                  <option value="graduated">Lulus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Data Orang Tua / Wali */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2">
              3. Data Orang Tua / Wali Murid
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={data.guardian_name}
                  onChange={(e) => setData('guardian_name', e.target.value)}
                  placeholder="Nama lengkap wali murid"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hubungan Keluarga
                </label>
                <select
                  value={data.guardian_relationship}
                  onChange={(e) => setData('guardian_relationship', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ayah">Ayah Kandung</option>
                  <option value="ibu">Ibu Kandung</option>
                  <option value="wali">Wali / Pengasuh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={data.guardian_phone}
                  onChange={(e) => setData('guardian_phone', e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pekerjaan Wali
                </label>
                <input
                  type="text"
                  value={data.guardian_occupation}
                  onChange={(e) => setData('guardian_occupation', e.target.value)}
                  placeholder="PNS / Swasta / Wiraswasta"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/students"
              className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Daftarkan Siswa')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

