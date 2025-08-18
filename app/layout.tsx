import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { LocalizationProvider } from '@/contexts/LocalizationContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Personal Wealth Management System | מערכת ניהול עושר אישי',
  description: 'Professional system for managing assets, investments and income | מערכת מקצועית לניהול נכסים, השקעות והכנסות',
  keywords: 'wealth management, assets, investments, real estate, income, expenses, ניהול עושר, נכסים, השקעות, נדלן, הכנסות, הוצאות',
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
        <LocalizationProvider>
          <MobileLayout>
            {children}
          </MobileLayout>
        </LocalizationProvider>
      </body>
    </html>
  )
}