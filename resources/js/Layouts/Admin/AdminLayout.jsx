import React from 'react'
import SidebarLayout from './SidebarLayout'
import HeaderLayout from './HeaderLayout'

export default function AdminLayout({ children, activePath = 'dashboard-sekolah' }) {
  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Sidebar Navigation */}
      <SidebarLayout activePath={activePath} />

      {/* Main Container */}
      <div className="pl-72">
        {/* Top Header */}
        <HeaderLayout />

        {/* Main Content Area */}
        <main className="w-full pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full">
            <div className="p-space-lg lg:p-margin-lg space-y-space-xl max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

