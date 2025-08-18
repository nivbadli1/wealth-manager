import { useState, useMemo } from 'react'
import { FilterValue } from '@/components/ui/SearchAndFilter'

export interface UseSearchAndFilterOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  initialFilters?: FilterValue
}

export interface FilterFunction<T> {
  (item: T, filters: FilterValue): boolean
}

export function useSearchAndFilter<T>({
  data,
  searchFields,
  initialFilters = {}
}: UseSearchAndFilterOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterValue>(initialFilters)

  const updateFilter = (key: string, value: string | number | string[] | { from?: Date; to?: Date } | { min?: string; max?: string } | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    setSearchTerm('')
  }

  const filteredData = useMemo(() => {
    let result = data

    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      result = result.filter(item => 
        searchFields.some(field => {
          const value = item[field]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    // Apply filters
    result = result.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        
        const itemValue = (item as Record<string, unknown>)[key]
        
        // Handle different filter types
        if (Array.isArray(value)) {
          // Multi-select filter
          return value.length === 0 || value.includes(itemValue as string)
        }
        
        if (typeof value === 'object' && value !== null) {
          // Handle date range
          if ('from' in value || 'to' in value) {
            const dateRange = value as { from?: Date; to?: Date }
            const itemDate = new Date(itemValue as string)
            const fromDate = dateRange.from ? new Date(dateRange.from) : null
            const toDate = dateRange.to ? new Date(dateRange.to) : null
            
            if (fromDate && itemDate < fromDate) return false
            if (toDate && itemDate > toDate) return false
            return true
          }
          
          // Handle number range
          if ('min' in value || 'max' in value) {
            const numberRange = value as { min?: string; max?: string }
            const numValue = Number(itemValue)
            if (numberRange.min && numberRange.min !== '' && numValue < Number(numberRange.min)) return false
            if (numberRange.max && numberRange.max !== '' && numValue > Number(numberRange.max)) return false
            return true
          }
        }
        
        // Simple equality check
        return itemValue === value
      })
    })

    return result
  }, [data, searchTerm, filters, searchFields])

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData
  }
}

// Helper function to create custom filter functions
export function createCustomFilter<T>(filterFn: FilterFunction<T>) {
  return filterFn
}

// Common filter functions
export const filterByDateRange = <T>(dateField: keyof T) => 
  createCustomFilter<T>((item, filters) => {
    const dateRange = filters.dateRange as { from?: Date; to?: Date } | undefined
    if (!dateRange?.from && !dateRange?.to) return true
    
    const itemDate = new Date(item[dateField] as string)
    const fromDate = dateRange.from ? new Date(dateRange.from) : null
    const toDate = dateRange.to ? new Date(dateRange.to) : null
    
    if (fromDate && itemDate < fromDate) return false
    if (toDate && itemDate > toDate) return false
    return true
  })

export const filterByAmountRange = <T>(amountField: keyof T) =>
  createCustomFilter<T>((item, filters) => {
    const range = filters.amountRange as { min?: string; max?: string } | undefined
    if (!range?.min && !range?.max) return true
    
    const amount = Number(item[amountField])
    if (range.min && amount < Number(range.min)) return false
    if (range.max && amount > Number(range.max)) return false
    return true
  })

export const filterByCategory = <T>(categoryField: keyof T) =>
  createCustomFilter<T>((item, filters) => {
    const categories = filters.categories as string[] | undefined
    if (!categories || categories.length === 0) return true
    return categories.includes(item[categoryField] as string)
  })
