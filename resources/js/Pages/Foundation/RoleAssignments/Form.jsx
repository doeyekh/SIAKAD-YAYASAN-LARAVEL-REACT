import React, { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/Admin/AdminLayout'

export default function RoleAssignmentForm({ assignment, users = [], schools = [], foundations = [], roles = {}, roleTypes = {}, academicYears = [], isSuperAdmin = false, foundationId = null }) {
  const isEditing = !!assignment
  const [selectedSchool, setSelectedSchool] = useState(assignment?.school_id || '')

  const yearsForSchool = academicYears.filter((ay) => String(ay.school_id) === String(selectedSchool))

  const { data, setData, post, put, processing, errors } = useForm({
    user_id: assignment?.user_id || '',
    school_id: assignment?.school_id || '',
    foundation_id: assignment?.foundation_id || foundationId || '',
    role: assignment?.role || '',
    role_type: assignment?.role_type || '',
    academic_year_id: assignment?.academic_year_id || '',
    is_active: assignment?.is_active ?? true,
  })

  const roleTypeMap = {
    super_admin: 'system',
    foundation_admin: 'foundation',
    student: 'student',
    guardian: 'guardian',
  }
  const handleRoleChange = (value) => {
    setData('role', value)
    setData('role_type', roleTypeMap[value] || 'school')
  }

  const handleSchoolChange = (value) => {
    setSelectedSchool(value)
    setData('school_id', value)
    setData('academic_year_id', '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      put(`/foundation/role-assignments/${assignment.id}`)
    } else {
      post('/foundation/role-assignments')
    }
  }

  return (
    <AdminLayout activePath="foundation.role-assignments">
      <Head title={`${isEditing ? 'Edit' : 'Tambah'} Penugasan Role - SIAKAD Al-Hikmah`} />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">{isEditing ? 'Edit' : 'Tambah'} Penugasan Role</h1>
          <Link href="/foundation/role-assignments" className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">User</label>
            <select value={data.user_id} onChange={(e) => setData('user_id', e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <option value="">Pilih user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
            {errors.user_id && <p className="text-[11px] text-rose-500 mt-1">{errors.user_id}</p>}
          </div>

          {isSuperAdmin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Yayasan</label>
              <select value={data.foundation_id} onChange={(e) => setData('foundation_id', e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white">
                <option value="">Pilih yayasan (opsional)</option>
                {foundations.map((foundation) => (
                  <option key={foundation.id} value={foundation.id}>{foundation.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
            <select value={data.role} onChange={(e) => handleRoleChange(e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <option value="">Pilih role</option>
              {Object.entries(roles).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {errors.role && <p className="text-[11px] text-rose-500 mt-1">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe Role</label>
            <select value={data.role_type} onChange={(e) => setData('role_type', e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <option value="">Pilih tipe role</option>
              {Object.entries(roleTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {errors.role_type && <p className="text-[11px] text-rose-500 mt-1">{errors.role_type}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sekolah</label>
            <select value={data.school_id} onChange={(e) => handleSchoolChange(e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <option value="">Tanpa sekolah / global</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>{school.name} ({school.educational_level})</option>
              ))}
            </select>
            {errors.school_id && <p className="text-[11px] text-rose-500 mt-1">{errors.school_id}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
            <select value={data.academic_year_id} onChange={(e) => setData('academic_year_id', e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white" disabled={!selectedSchool}>
              <option value="">Pilih tahun ajaran</option>
              {yearsForSchool.map((year) => (
                <option key={year.id} value={year.id}>{year.name} {year.is_active ? '(aktif)' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select value={data.is_active ? '1' : '0'} onChange={(e) => setData('is_active', e.target.value === '1')} className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Link href="/foundation/role-assignments" className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700">
              Batal
            </Link>
            <button type="submit" disabled={processing} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm disabled:opacity-50">
              {processing ? 'Menyimpan...' : (isEditing ? 'Simpan' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
