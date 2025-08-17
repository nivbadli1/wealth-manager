import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'מערכת ניהול עושר אישי',
  description: 'מערכת מקצועית לניהול נכסים, השקעות והכנסות',
  keywords: 'ניהול עושר, נכסים, השקעות, נדלן, הכנסות, הוצאות',
  authors: [{ name: 'Wealth Manager' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-900">
        {/* Professional dark layout */}
        <div className="flex h-screen">
          {/* Professional dark sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col mr-64">
            {/* Professional dark header */}
            <Header />
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}