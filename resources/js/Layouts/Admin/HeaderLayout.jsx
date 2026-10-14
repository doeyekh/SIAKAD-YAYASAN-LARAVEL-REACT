import React, { useState } from 'react'
import { usePage, router } from '@inertiajs/react'

export default function HeaderLayout() {
  const { auth, flash } = usePage().props
  const [showSchoolSwitcher, setShowSchoolSwitcher] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const activeSchool = auth?.active_school
  const activeRole = auth?.active_role
  const user = auth?.user
  const availableAssignments = auth?.available_assignments || []

  const handleSwitchContext = (schoolId, role) => {
    setShowSchoolSwitcher(false)
    router.post('/switch-context', {
      school_id: schoolId,
      role: role,
    })
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'foundation_admin': return 'Admin Yayasan'
      case 'principal': return 'Kepala Sekolah'
      case 'school_admin': return 'Admin Sekolah / TU'
      case 'teacher': return 'Guru Pengampu'
      case 'homeroom_teacher': return 'Wali Kelas'
      case 'treasurer': return 'Bendahara'
      case 'student': return 'Siswa'
      case 'guardian': return 'Orang Tua'
      default: return role || 'Pengguna'
    }
  }

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-6">
      {/* Left side: Context Switchers */}
      <div className="flex items-center gap-3">
        {/* School Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowSchoolSwitcher(!showSchoolSwitcher)
              setShowUserMenu(false)
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-emerald-600 text-lg">
              {activeSchool ? 'account_balance' : 'hub'}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {activeSchool ? activeSchool.name : 'Konsol Yayasan Al-Hikmah'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium leading-tight">
                {activeSchool ? `${activeSchool.educational_level || 'Unit'} • NPSN: ${activeSchool.npsn}` : 'Semua Unit Sekolah'}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm ml-1">expand_more</span>
          </button>

          {/* Switcher Dropdown */}
          {showSchoolSwitcher && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Ganti Satuan / Peran
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                {availableAssignments.map((item, idx) => {
                  const isCurrent =
                    item.school_id === (activeSchool?.id ?? null) &&
                    item.role === activeRole

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSwitchContext(item.school_id, item.role)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50/70 text-emerald-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{item.school_name}</div>
                        <div className="text-[11px] text-slate-500">{item.role_label}</div>
                      </div>
                      {isCurrent && (
                        <span className="material-symbols-outlined text-emerald-600 text-sm">
                          check_circle
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Current Active Role Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs">
          <span className="material-symbols-outlined text-sm text-slate-500">badge</span>
          <span className="font-medium text-slate-800">{getRoleBadge(activeRole)}</span>
        </div>

        <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>TA 2026/2027 Ganjil</span>
        </div>
      </div>

      {/* Right side: Search, Notifications & User Menu */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-xs">
          <span className="material-symbols-outlined text-base">search</span>
          <span className="text-slate-400">Cari data siswa, guru, kelas...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-500 text-[10px] font-mono shadow-sm">Ctrl+K</kbd>
        </div>

        {/* User Profile & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowSchoolSwitcher(false)
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                {user?.name || 'Pengguna'}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lg border border-slate-100 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Keluar dari Sistem
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
