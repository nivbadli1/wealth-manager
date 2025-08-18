"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

export interface FilterOption {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'dateRange' | 'numberRange'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

export interface FilterValue {
  [key: string]: string | number | string[] | { from?: Date; to?: Date } | { min?: string; max?: string } | null | undefined
}

export interface SearchAndFilterProps {
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  filterOptions: FilterOption[]
  filterValues: FilterValue
  onFilterChange: (key: string, value: string | number | string[] | { from?: Date; to?: Date } | { min?: string; max?: string } | null) => void
  onClearFilters: () => void
  className?: string
}

export function SearchAndFilter({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterOptions,
  filterValues,
  onFilterChange,
  onClearFilters,
  className = ""
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFiltersCount = Object.values(filterValues).filter(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== null && v !== undefined && v !== '')
    }
    return value !== null && value !== undefined && value !== ''
  }).length

  const renderFilterInput = (option: FilterOption) => {
    const value = filterValues[option.key]

    switch (option.type) {
      case 'select':
        return (
          <Select
            value={typeof value === 'string' ? value : ''}
            onValueChange={(newValue) => onFilterChange(option.key, newValue || null)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder={option.placeholder || option.label} />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="">הכל</SelectItem>
              {option.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(newValue) => {
                if (newValue && !selectedValues.includes(newValue)) {
                  onFilterChange(option.key, [...selectedValues, newValue])
                }
              }}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder={option.placeholder || option.label} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {option.options
                  ?.filter(opt => !selectedValues.includes(opt.value))
                  .map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val) => {
                  const optLabel = option.options?.find(opt => opt.value === val)?.label || val
                  return (
                    <Badge key={val} variant="secondary" className="bg-slate-600 text-white">
                      {optLabel}
                      <button
                        onClick={() => onFilterChange(option.key, selectedValues.filter(v => v !== val))}
                        className="mr-1 hover:bg-slate-500 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        )

      case 'dateRange':
        const dateRange = (typeof value === 'object' && value && !Array.isArray(value) && 'from' in value) 
          ? value as { from?: Date; to?: Date } 
          : { from: undefined, to: undefined }
        return (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 flex-1"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {dateRange.from ? format(new Date(dateRange.from), 'dd/MM/yyyy', { locale: he }) : 'מתאריך'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600">
                <Calendar
                  mode="single"
                  selected={dateRange.from ? new Date(dateRange.from) : undefined}
                  onSelect={(date) => onFilterChange(option.key, { ...dateRange, from: date })}
                  className="bg-slate-700 text-white"
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 flex-1"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {dateRange.to ? format(new Date(dateRange.to), 'dd/MM/yyyy', { locale: he }) : 'עד תאריך'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600">
                <Calendar
                  mode="single"
                  selected={dateRange.to ? new Date(dateRange.to) : undefined}
                  onSelect={(date) => onFilterChange(option.key, { ...dateRange, to: date })}
                  className="bg-slate-700 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case 'numberRange':
        const numberRange = (typeof value === 'object' && value && !Array.isArray(value) && 'min' in value) 
          ? value as { min?: string; max?: string } 
          : { min: '', max: '' }
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="מינימום"
              value={numberRange.min}
              onChange={(e) => onFilterChange(option.key, { ...numberRange, min: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            <Input
              type="number"
              placeholder="מקסימום"
              value={numberRange.max}
              onChange={(e) => onFilterChange(option.key, { ...numberRange, max: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="btn-secondary relative"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 ml-2" />
            סינון
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500 text-white text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4 ml-1" />
              נקה
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white text-lg">סינון מתקדם</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map((option) => (
                <div key={option.key} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    {option.label}
                  </label>
                  {renderFilterInput(option)}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-600">
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="text-slate-400 hover:text-white"
              >
                נקה הכל
              </Button>
              <Button
                onClick={() => setIsFilterOpen(false)}
                className="btn-primary"
              >
                החל סינון
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
