"use client"

import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { he, enUS } from 'date-fns/locale'
import {
  Calendar, User, ChevronLeft, Menu,
} from 'lucide-react'
import Link from 'next/link'
import { LocalizationControls, CompactLocalizationControls } from '@/components/ui/LocalizationControls'
import { useLocalization } from '@/contexts/LocalizationContext'
import { TranslationKey } from '@/lib/translations'

// Helper to generate breadcrumbs
function getBreadcrumbs(pathname: string, t: (key: TranslationKey) => string) {
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const breadcrumbs = [{ label: t('dashboard'), href: '/' }]

  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    let label = segment

    // Map segment to translated label
    switch (segment) {
      case 'properties': label = t('properties'); break;
      case 'new': label = t('new'); break;
      case 'edit': label = t('edit'); break;
      case 'investments': label = t('investments'); break;
      case 'income': label = t('income'); break;
      case 'expenses': label = t('expenses'); break;
      case 'reports': label = t('reports'); break;
      case 'settings': label = t('settings'); break;
      case 'data': label = t('dataManagement'); break;
      default:
        // For dynamic segments (like property IDs), show a generic label
        if (segment.match(/^[a-zA-Z0-9]{20,}$/)) {
          // This looks like a database ID, show a generic label
          const parentSegment = pathSegments[index - 1];
          if (parentSegment === 'properties') {
            label = t('propertyDetails');
          } else if (parentSegment === 'income') {
            label = t('incomeDetails');
          } else if (parentSegment === 'expenses') {
            label = t('expenseDetails');
          } else {
            label = t('details');
          }
        } else {
          label = decodeURIComponent(segment);
        }
        break;
    }
    breadcrumbs.push({ label, href })
  })

  return breadcrumbs
}

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const { t, language } = useLocalization()
  const breadcrumbs = getBreadcrumbs(pathname, t)
  const currentDate = new Date()

  const formatDate = (date: Date) => {
    const locale = language === 'he' ? he : enUS
    return format(date, 'EEEE, d MMMM yyyy', { locale });
  };

  return (
    <header className="bg-slate-800 border-b border-slate-600 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side - Localization Controls (top-left as requested) */}
        <div className="flex items-center gap-3">
          {/* Localization Controls - Full version on larger screens */}
          <div className="hidden sm:block">
            <LocalizationControls />
          </div>
          
          {/* Compact version on mobile */}
          <div className="block sm:hidden">
            <CompactLocalizationControls />
          </div>
        </div>

        {/* Center - Mobile menu button and breadcrumbs */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-1 justify-center sm:justify-start sm:ml-4">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronLeft className="h-4 w-4 mx-1 text-slate-400 rtl:rotate-180" />
                )}
                {crumb.href && index < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-slate-300 hover:text-white transition-colors font-medium hidden sm:block"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-semibold text-base sm:text-lg truncate max-w-[200px] sm:max-w-none">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - Date and User */}
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
          {/* Current Date - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-300 font-medium px-3 py-2 bg-slate-700 rounded-lg border border-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="tracking-wide">{formatDate(currentDate)}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-slate-700 rounded-lg border border-slate-600">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-200 hidden sm:block">{t('user')}</span>
          </div>
        </div>
      </div>
    </header>
  )
}