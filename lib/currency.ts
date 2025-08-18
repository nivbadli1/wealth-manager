import { Currency, Language } from './translations'

// Placeholder exchange rate - can be easily replaced with live rate API
const EXCHANGE_RATES = {
  ILS_TO_USD: 0.27, // 1 ILS = 0.27 USD (approximate)
  USD_TO_ILS: 3.7,  // 1 USD = 3.7 ILS (approximate)
} as const

export interface CurrencyConfig {
  currency: Currency
  language: Language
}

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  if (fromCurrency === 'ILS' && toCurrency === 'USD') {
    return amount * EXCHANGE_RATES.ILS_TO_USD
  }

  if (fromCurrency === 'USD' && toCurrency === 'ILS') {
    return amount * EXCHANGE_RATES.USD_TO_ILS
  }

  return amount
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  language: Language
): string {
  const locale = getLocaleForCurrency(currency, language)
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount)
}

export function formatNumber(
  num: number,
  language: Language
): string {
  const locale = language === 'he' ? 'he-IL' : 'en-US'
  return new Intl.NumberFormat(locale).format(num)
}

function getLocaleForCurrency(currency: Currency, language: Language): string {
  // For ILS, always use Hebrew locale for proper RTL formatting
  if (currency === 'ILS') {
    return 'he-IL'
  }
  
  // For USD, use the language preference
  return language === 'he' ? 'he-IL' : 'en-US'
}

// Helper function to get currency symbol
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'ILS' ? '₪' : '$'
}

// Helper to update exchange rates (for future API integration)
export function updateExchangeRates(newRates: Partial<typeof EXCHANGE_RATES>) {
  Object.assign(EXCHANGE_RATES, newRates)
}

// Get current exchange rates (for display or API calls)
export function getCurrentExchangeRates() {
  return { ...EXCHANGE_RATES }
}
