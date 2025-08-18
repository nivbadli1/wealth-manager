"use client"

import React from 'react'
import { useLocalization } from '@/contexts/LocalizationContext'
import { Globe, DollarSign } from 'lucide-react'

interface ToggleButtonProps {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
  ariaLabel: string
  className?: string
}

function ToggleButton({ isActive, onClick, children, ariaLabel, className = '' }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        px-2 py-1 text-xs font-medium rounded transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${isActive 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

interface LocalizationControlsProps {
  className?: string
}

export function LocalizationControls({ className = '' }: LocalizationControlsProps) {
  const { language, currency, setLanguage, setCurrency } = useLocalization()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Language Toggle */}
      <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-600">
        <Globe className="h-3 w-3 text-slate-400 flex-shrink-0" />
        <div className="flex">
          <ToggleButton
            isActive={language === 'he'}
            onClick={() => setLanguage('he')}
            ariaLabel="Switch to Hebrew"
            className="rounded-r-none border-r border-slate-600"
          >
            עב
          </ToggleButton>
          <ToggleButton
            isActive={language === 'en'}
            onClick={() => setLanguage('en')}
            ariaLabel="Switch to English"
            className="rounded-l-none"
          >
            EN
          </ToggleButton>
        </div>
      </div>

      {/* Currency Toggle */}
      <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-600">
        <DollarSign className="h-3 w-3 text-slate-400 flex-shrink-0" />
        <div className="flex">
          <ToggleButton
            isActive={currency === 'ILS'}
            onClick={() => setCurrency('ILS')}
            ariaLabel="Switch to Israeli Shekel"
            className="rounded-r-none border-r border-slate-600"
          >
            ₪
          </ToggleButton>
          <ToggleButton
            isActive={currency === 'USD'}
            onClick={() => setCurrency('USD')}
            ariaLabel="Switch to US Dollar"
            className="rounded-l-none"
          >
            $
          </ToggleButton>
        </div>
      </div>
    </div>
  )
}

// Alternative single-button toggle version for very small screens
export function CompactLocalizationControls({ className = '' }: LocalizationControlsProps) {
  const { language, currency, setLanguage, setCurrency } = useLocalization()

  return (
    <div className={`flex gap-1 ${className}`}>
      <button
        onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
        aria-label={`Switch to ${language === 'he' ? 'English' : 'Hebrew'}`}
        className="flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors duration-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <Globe className="h-4 w-4" />
      </button>
      <button
        onClick={() => setCurrency(currency === 'ILS' ? 'USD' : 'ILS')}
        aria-label={`Switch to ${currency === 'ILS' ? 'USD' : 'ILS'}`}
        className="flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors duration-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xs font-bold"
      >
        {currency === 'ILS' ? '$' : '₪'}
      </button>
    </div>
  )
}
