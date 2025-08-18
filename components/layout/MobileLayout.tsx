"use client"

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div className="fixed inset-y-0 right-0 w-64 z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop layout */}
      <div className="flex h-screen">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:mr-64">
          {/* Header with mobile menu button */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
