import React from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/Admin/AdminLayout'

export default function RoleAssignmentsIndex({ assignments, filters }) {
  const handleDelete = (id, label) => {
    if (confirm(`Hapus penugasan ${label}?`)) {
      router.delete(`/foundation/role-assignments/${id}`)
    }
  }

  return (
    <AdminLayout activePath="foundation.role-assignments">
      <Head title="Manajemen Role - SIAKAD Al-Hikmah" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">Manajemen Role & Penugasan</h1>
          <p className="text-xs text-slate-500">Atur user, sekolah, yayasan, role, dan tahun ajaran</p>
        </div>
        <Link href="/foundation/role-assignments/create" className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl">
          Tambah Penugasan
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-500 uppercase tracking-wider font-semibold border-b">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tipe Role</th>
                <th className="py-3 px-4">Sekolah</th>
                <th className="py-3 px-4">Tahun Ajaran</th>
                <th className="py-3 px-4">Yayasan ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.data.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">Belum ada penugasan.</td></tr>
              ) : assignments.data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{item.user?.name}</div>
                    <div className="text-[10px] text-slate-400">{item.user?.email}</div>
                  </td>
                  <td className="py-3 px-4">{item.role}</td>
                  <td className="py-3 px-4">{item.role_type}</td>
                  <td className="py-3 px-4">{item.school?.name || '-'}</td>
                  <td className="py-3 px-4">{item.academic_year?.name || '-'}</td>
                  <td className="py-3 px-4">{item.foundation_id || '-'}</td>
                  <td className="py-3 px-4">{item.is_active ? 'Aktif' : 'Nonaktif'}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link href={`/foundation/role-assignments/${item.id}/edit`} className="text-emerald-600 hover:underline">Edit</Link>
                    <button type="button" onClick={() => handleDelete(item.id, item.user?.name)} className="text-rose-600 hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {assignments.links && assignments.links.length > 3 && (
          <div className="px-4 py-3 border-t border-slate-100 flex justify-between text-xs">
            <span>Menampilkan {assignments.from || 0} - {assignments.to || 0} dari {assignments.total}</span>
            <div className="flex gap-1">
              {assignments.links.map((link, idx) => (
                <Link key={idx} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-2 py-1 rounded ${link.active ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100'}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
