import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/login')
  }

  const fillQuickAccount = (email, password = 'password') => {
    setData((prev) => ({
      ...prev,
      email,
      password,
    }))
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <Head title="Masuk - SIAKAD Yayasan Al-Hikmah" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 mb-4">
          <span className="material-symbols-outlined text-3xl">school</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
          SIAKAD Multi-Sekolah
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Yayasan Pendidikan Al-Hikmah • Portal Terpadu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E5EBE8] rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Alamat Email
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`block w-full rounded-xl border ${
                    errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600'
                  } px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2`}
                  placeholder="nama@alhikmah.sch.id"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Kata Sandi
                </label>
              </div>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <input
                  id="password"
                  type="password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={`block w-full rounded-xl border ${
                    errors.password ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600'
                  } px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="remember" className="ml-2 block text-xs text-slate-600">
                  Ingat sesi saya
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </span>
                ) : (
                  'Masuk ke Sistem'
                )}
              </button>
            </div>
          </form>

          {/* Demo Quick Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Akun Uji Coba Multi-Role (Fase 1 MVP)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin.yayasan@alhikmah.sch.id')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-800">Admin Yayasan</div>
                <div className="text-[11px] text-slate-500 truncate">Semua Sekolah</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('kepsek.sma@alhikmah.sch.id')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-800">Kepala Sekolah</div>
                <div className="text-[11px] text-slate-500 truncate">SMA Plus 1</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('admin.sma@alhikmah.sch.id')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-800">Admin / TU</div>
                <div className="text-[11px] text-slate-500 truncate">SMA Plus 1</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('guru.sma@alhikmah.sch.id')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-800">Guru &amp; Wali Kelas</div>
                <div className="text-[11px] text-slate-500 truncate">SMA Plus 1</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">Password default: <span className="font-mono text-slate-600">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

