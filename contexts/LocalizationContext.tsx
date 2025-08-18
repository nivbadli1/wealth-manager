"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Language, Currency, TranslationKey, getTranslation, getLanguageDirection } from '@/lib/translations'
import { formatCurrency as formatCurrencyUtil, convertCurrency, formatNumber } from '@/lib/currency'

interface LocalizationContextType {
  language: Language
  currency: Currency
  setLanguage: (language: Language) => void
  setCurrency: (currency: Currency) => void
  t: (key: TranslationKey) => string
  formatCurrency: (amount: number, sourceCurrency?: Currency) => string
  formatNumber: (num: number) => string
  convertAmount: (amount: number, fromCurrency: Currency) => number
  direction: 'ltr' | 'rtl'
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

const STORAGE_KEYS = {
  LANGUAGE: 'wealth-manager-language',
  CURRENCY: 'wealth-manager-currency',
} as const

interface LocalizationProviderProps {
  children: React.ReactNode
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [language, setLanguageState] = useState<Language>('he')
  const [currency, setCurrencyState] = useState<Currency>('ILS')
  const [isInitialized, setIsInitialized] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null
      const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency | null

      if (savedLanguage && (savedLanguage === 'he' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
      }

      if (savedCurrency && (savedCurrency === 'ILS' || savedCurrency === 'USD')) {
        setCurrencyState(savedCurrency)
      }

      setIsInitialized(true)
    }
  }, [])

  // Update document direction when language changes
  useEffect(() => {
    if (isInitialized && typeof document !== 'undefined') {
      const direction = getLanguageDirection(language)
      document.documentElement.dir = direction
      document.documentElement.lang = language === 'he' ? 'he' : 'en'
    }
  }, [language, isInitialized])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage)
    }
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, newCurrency)
    }
  }

  const t = (key: TranslationKey): string => {
    return getTranslation(key, language)
  }

  const formatCurrency = (amount: number, sourceCurrency: Currency = 'ILS'): string => {
    const convertedAmount = convertCurrency(amount, sourceCurrency, currency)
    return formatCurrencyUtil(convertedAmount, currency, language)
  }

  const formatNumberLocalized = (num: number): string => {
    return formatNumber(num, language)
  }

  const convertAmount = (amount: number, fromCurrency: Currency): number => {
    return convertCurrency(amount, fromCurrency, currency)
  }

  const direction = getLanguageDirection(language)

  const contextValue: LocalizationContextType = {
    language,
    currency,
    setLanguage,
    setCurrency,
    t,
    formatCurrency,
    formatNumber: formatNumberLocalized,
    convertAmount,
    direction,
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization(): LocalizationContextType {
  const context = useContext(LocalizationContext)
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider')
  }
  return context
}
