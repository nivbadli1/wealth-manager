import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

// Type-safe object access utility
export function safeGet<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K
): T[K] | undefined {
  return obj[key]
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function calculateROI(currentValue: number, initialValue: number): number {
  return ((currentValue - initialValue) / initialValue) * 100
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('he-IL').format(num)
}