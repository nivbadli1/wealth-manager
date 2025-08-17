"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2, LayoutDashboard, LandPlot, PiggyBank, ReceiptText, BarChart3, Settings, PlusCircle, Banknote, Database,
} from 'lucide-react'

const navigation = [
  { name: 'דשבורד', href: '/', icon: LayoutDashboard },
  {
    name: 'נכסים',
    href: '/properties',
    icon: LandPlot,
    subItems: [
      { name: 'כל הנכסים', href: '/properties' },
      { name: 'הוסף נכס', href: '/properties/new' },
    ],
  },
  {
    name: 'השקעות',
    href: '/investments',
    icon: PiggyBank,
    subItems: [
      { name: 'כל ההשקעות', href: '/investments' },
      { name: 'הוסף השקעה', href: '/investments/new' },
    ],
  },
  {
    name: 'הכנסות',
    href: '/income',
    icon: Banknote,
    subItems: [
      { name: 'כל ההכנסות', href: '/income' },
      { name: 'הוסף הכנסה', href: '/income/new' },
    ],
  },
  {
    name: 'הוצאות',
    href: '/expenses',
    icon: ReceiptText,
    subItems: [
      { name: 'כל ההוצאות', href: '/expenses' },
      { name: 'הוסף הוצאה', href: '/expenses/new' },
    ],
  },
  { name: 'דוחות וניתוח', href: '/reports', icon: BarChart3 },
  { name: 'ניהול נתונים', href: '/data', icon: Database },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-slate-800 border-l border-slate-600 shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 border-b border-slate-600 bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ניהול עושר</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
                
                {/* Sub-items */}
                {item.subItems && isActive && (
                  <div className="mr-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 font-medium",
                          pathname === subItem.href && "text-blue-400 bg-slate-700 font-semibold"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-600 bg-slate-700">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">פעולות מהירות</h4>
            <Link
              href="/properties/new"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              הוסף נכס
            </Link>
            <Link
              href="/income/new" 
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              הוסף הכנסה
            </Link>
            <Link
              href="/expenses/new"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              הוסף הוצאה
            </Link>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-slate-600">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 font-medium"
          >
            <Settings className="h-5 w-5 text-slate-400" />
            <span className="font-medium">הגדרות</span>
          </Link>
        </div>
      </div>
    </div>
  )
}