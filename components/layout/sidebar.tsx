"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2, LayoutDashboard, LandPlot, PiggyBank, ReceiptText, BarChart3, Settings, PlusCircle, Banknote, Database, X,
} from 'lucide-react'
import { useLocalization } from '@/contexts/LocalizationContext'
import { TranslationKey } from '@/lib/translations'

function getNavigation(t: (key: TranslationKey) => string) {
  return [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard },
    {
      name: t('properties'),
      href: '/properties',
      icon: LandPlot,
      subItems: [
        { name: t('allProperties'), href: '/properties' },
        { name: t('addProperty'), href: '/properties/new' },
      ],
    },
    {
      name: t('investments'),
      href: '/investments',
      icon: PiggyBank,
      subItems: [
        { name: t('allInvestments'), href: '/investments' },
        { name: t('addInvestment'), href: '/investments/new' },
      ],
    },
    {
      name: t('income'),
      href: '/income',
      icon: Banknote,
      subItems: [
        { name: t('allIncome'), href: '/income' },
        { name: t('addIncome'), href: '/income/new' },
      ],
    },
    {
      name: t('expenses'),
      href: '/expenses',
      icon: ReceiptText,
      subItems: [
        { name: t('allExpenses'), href: '/expenses' },
        { name: t('addExpense'), href: '/expenses/new' },
      ],
    },
    { name: t('reports'), href: '/reports', icon: BarChart3 },
    { name: t('dataManagement'), href: '/data', icon: Database },
  ]
}

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLocalization()
  const navigation = getNavigation(t)

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-slate-800 border-l border-slate-600 shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 border-b border-slate-600 bg-slate-800 px-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{t('wealthManagement')}</span>
          </div>
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
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
                  onClick={() => onClose?.()}
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
                        onClick={() => onClose?.()}
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
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">{t('quickActions')}</h4>
            <Link
              href="/properties/new"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
              onClick={() => onClose?.()}
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              {t('addProperty')}
            </Link>
            <Link
              href="/income/new" 
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
              onClick={() => onClose?.()}
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              {t('addIncome')}
            </Link>
            <Link
              href="/expenses/new"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
              onClick={() => onClose?.()}
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              {t('addExpense')}
            </Link>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-slate-600">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 font-medium"
            onClick={() => onClose?.()}
          >
            <Settings className="h-5 w-5 text-slate-400" />
            <span className="font-medium">{t('settings')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}