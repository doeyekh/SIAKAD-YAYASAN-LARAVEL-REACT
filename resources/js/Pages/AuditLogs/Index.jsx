import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '../../Layouts/Admin/AdminLayout'

export default function AuditLogsIndex({ logs }) {
  const [expandedLogId, setExpandedLogId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id)
  }

  const getActionBadge = (action) => {
    switch (action) {
      case 'created':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">CREATED</span>
      case 'updated':
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px]">UPDATED</span>
      case 'deleted':
        return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[10px]">DELETED</span>
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">{action.toUpperCase()}</span>
    }
  }

  return (
    <AdminLayout activePath="audit-logs">
      <Head title="Audit Trail (Jejak Rekam Sistem) - SIAKAD Al-Hikmah" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Audit Trail &amp; Log Perubahan Data
          </h1>
          <p className="text-xs text-slate-500">
            Jejak audit permanen mencatat seluruh mutasi data siswa, perubahan nilai, dan aktivitas administratif
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium">
          <span className="material-symbols-outlined text-sm text-emerald-600">verified_user</span>
          Integritas Log Terjamin
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5EBE8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F8FAF9] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Aksi</th>
                <th className="py-3 px-4">Entitas &amp; ID</th>
                <th className="py-3 px-4">Pelaku (Pengguna)</th>
                <th className="py-3 px-4">Unit Sekolah</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Detail Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Belum ada rekaman audit log.
                  </td>
                </tr>
              ) : (
                logs.data.map((log) => {
                  const isExpanded = expandedLogId === log.id
                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {log.created_at}
                        </td>
                        <td className="py-3 px-4">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {log.entity} #{log.entity_id}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {log.user_name}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {log.school_name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {log.ip_address || '127.0.0.1'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpand(log.id)}
                            className="px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium text-[11px] transition-colors"
                          >
                            {isExpanded ? 'Tutup' : 'Lihat Diff'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                          <td colSpan="7" className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                              <div className="p-3 rounded-xl bg-white border border-slate-200">
                                <span className="text-slate-400 block mb-1 font-sans font-semibold uppercase text-[10px]">
                                  Nilai Sebelumnya (Before)
                                </span>
                                <pre className="text-[11px] text-slate-600 overflow-x-auto whitespace-pre-wrap">
                                  {log.old_values ? JSON.stringify(log.old_values, null, 2) : 'Tidak ada (Entitas Baru)'}
                                </pre>
                              </div>
                              <div className="p-3 rounded-xl bg-white border border-slate-200">
                                <span className="text-emerald-700 block mb-1 font-sans font-semibold uppercase text-[10px]">
                                  Nilai Baru (After)
                                </span>
                                <pre className="text-[11px] text-slate-800 overflow-x-auto whitespace-pre-wrap">
                                  {log.new_values ? JSON.stringify(log.new_values, null, 2) : 'Dihapus'}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logs.links && logs.links.length > 3 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Menampilkan {logs.from || 0} - {logs.to || 0} dari {logs.total} log audit
            </span>
            <div className="flex gap-1">
              {logs.links.map((link, idx) => (
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

