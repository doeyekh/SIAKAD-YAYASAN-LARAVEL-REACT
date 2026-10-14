import React from 'react'
import { Link, usePage } from '@inertiajs/react'

export default function SidebarLayout({ activePath = 'dashboard' }) {
  const { auth } = usePage().props
  const activeSchool = auth?.active_school
  const activeRole = auth?.active_role
  const isFoundationUser = auth?.is_foundation_level || ['super_admin', 'foundation_admin'].includes(activeRole)
  const isFoundationView = auth?.is_foundation_level && !activeSchool

  const navItems = [
    {
      group: 'Ikhtisar',
      items: [
        { name: `Dashboard ${isFoundationView ? 'Yayasan' : 'Sekolah'}`, href: '/', path: 'dashboard', icon: 'dashboard' },
      ],
    },
    ...(isFoundationUser
      ? [
          {
            group: 'Manajemen Yayasan',
            items: [
              { name: 'Manajemen Sekolah', href: '/foundation/schools', path: 'foundation-schools', icon: 'domain_add' },
              { name: 'Tahun Ajaran & Semester', href: '/foundation/academic-years', path: 'foundation-academic-years', icon: 'date_range' },
               { name: 'Role & Penugasan', href: '/foundation/role-assignments', path: 'foundation-role-assignments', icon: 'admin_panel_settings' },
            ],
          },
        ]
      : []),
    {
      group: 'Kesiswaan & Akademik',
      items: [
        { name: 'Data Siswa', href: '/students', path: 'students', icon: 'groups' },
        { name: 'Rombel & Kelas', href: '/classrooms', path: 'classrooms', icon: 'door_front' },
        { name: 'Mata Pelajaran & KKM', href: '/subjects', path: 'subjects', icon: 'grade' },
      ],
    },
    {
      group: 'Kepegawaian',
      items: [
        { name: 'Direktori Guru & Staf', href: '/teachers', path: 'teachers', icon: 'badge' },
      ],
    },
    {
      group: 'Pengawasan & Audit',
      items: [
        { name: 'Audit Trail (Log)', href: '/audit-logs', path: 'audit-logs', icon: 'history' },
      ],
    },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm overflow-y-auto">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 bg-white sticky top-0 z-10 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-600/20">
          <span className="material-symbols-outlined text-xl">school</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-900 tracking-tight truncate leading-tight font-['Plus_Jakarta_Sans']">
            SIAKAD Al-Hikmah
          </span>
          <span className="text-[11px] text-slate-500 truncate">
            {isFoundationView ? 'Tingkat Yayasan' : 'Tingkat Sekolah'}
          </span>
        </div>
      </div>

      {/* School Unit Banner */}
      <div className="px-4 py-3">
        <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">
              {isFoundationView ? 'account_balance' : 'domain'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isFoundationView ? 'Konsol Pusat' : 'Satuan Pendidikan'}
            </p>
            <p className="text-xs font-semibold text-slate-800 truncate">
              {activeSchool ? activeSchool.name : 'Yayasan Al-Hikmah'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 space-y-4">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.group}
            </p>
            {section.items.map((item, itemIdx) => {
              const isActive = activePath === item.path
              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm shadow-emerald-50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}