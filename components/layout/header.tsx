"use client"

import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import {
  Calendar, User, ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'

// Helper to generate breadcrumbs
function getBreadcrumbs(pathname: string) {
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const breadcrumbs = [{ label: 'דשבורד', href: '/' }]

  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    let label = segment

    // Map segment to Hebrew label
    switch (segment) {
      case 'properties': label = 'נכסים'; break;
      case 'new': label = 'חדש'; break;
      case 'edit': label = 'עריכה'; break;
      case 'investments': label = 'השקעות'; break;
      case 'income': label = 'הכנסות'; break;
      case 'expenses': label = 'הוצאות'; break;
      case 'reports': label = 'דוחות'; break;
      case 'settings': label = 'הגדרות'; break;
      case 'data': label = 'ניהול נתונים'; break;
      default:
        // For dynamic segments (like property IDs), show a generic label
        if (segment.match(/^[a-zA-Z0-9]{20,}$/)) {
          // This looks like a database ID, show a generic label
          const parentSegment = pathSegments[index - 1];
          if (parentSegment === 'properties') {
            label = 'פרטי נכס';
          } else if (parentSegment === 'income') {
            label = 'פרטי הכנסה';
          } else if (parentSegment === 'expenses') {
            label = 'פרטי הוצאה';
          } else {
            label = 'פרטים';
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

export function Header() {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)
  const currentDate = new Date()

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, d MMMM yyyy', { locale: he });
  };

  return (
    <header className="bg-slate-800 border-b border-slate-600 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronLeft className="h-4 w-4 mx-1 text-slate-400 rtl:rotate-180" />
                )}
                {crumb.href && index < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-semibold text-lg">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - Date and User */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Current Date */}
          <div className="flex items-center gap-2 text-sm text-slate-300 font-medium px-3 py-2 bg-slate-700 rounded-lg border border-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="tracking-wide">{formatDate(currentDate)}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg border border-slate-600">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-200">משתמש</span>
          </div>
        </div>
      </div>
    </header>
  )
}