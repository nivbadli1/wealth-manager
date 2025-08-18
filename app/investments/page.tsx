'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { SearchAndFilter, FilterOption } from '@/components/ui/SearchAndFilter'
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter'
import { useLocalization } from '@/contexts/LocalizationContext'
import Link from 'next/link'
import {
  PlusCircle, Edit, Trash2, Eye, DollarSign, FileText, PiggyBank, TrendingUp
} from 'lucide-react'

interface Investment {
  id: string
  type: string
  name: string
  initialAmount: number
  currentValue: number
  date: string
  returnRate?: number
}

const typeColors = {
  stocks: 'bg-blue-100 text-blue-800',
  mutual_fund: 'bg-green-100 text-green-800',
  pension: 'bg-purple-100 text-purple-800',
  study_fund: 'bg-orange-100 text-orange-800',
  savings: 'bg-yellow-100 text-yellow-800',
  bonds: 'bg-indigo-100 text-indigo-800',
  crypto: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
}

export default function InvestmentsPage() {
  const { t } = useLocalization()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: t('investmentType'),
      type: 'multiselect',
      options: [
        { value: 'stocks', label: t('stocks') },
        { value: 'mutual_fund', label: t('mutualFund') },
        { value: 'pension', label: t('pension') },
        { value: 'study_fund', label: t('studyFund') },
        { value: 'savings', label: t('savings') },
        { value: 'bonds', label: t('bonds') },
        { value: 'crypto', label: t('crypto') },
        { value: 'other', label: t('other') }
      ]
    },
    {
      key: 'date',
      label: t('investmentDate'),
      type: 'dateRange'
    },
    {
      key: 'currentValue',
      label: t('currentValue'),
      type: 'numberRange'
    },
    {
      key: 'initialAmount',
      label: t('initialAmount'),
      type: 'numberRange'
    }
  ]

  const typeLabels = {
    stocks: t('stocks'),
    mutual_fund: t('mutualFund'),
    pension: t('pension'),
    study_fund: t('studyFund'),
    savings: t('savings'),
    bonds: t('bonds'),
    crypto: t('crypto'),
    other: t('other'),
  }

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData: filteredInvestments
  } = useSearchAndFilter({
    data: investments,
    searchFields: ['name', 'type'],
    initialFilters: {}
  })

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch('/api/investments')
        if (!response.ok) {
          throw new Error('Failed to fetch investments')
        }
        const data = await response.json()
        setInvestments(data)
      } catch (error) {
        console.error('Error fetching investments:', error)
        setError('שגיאה בטעינת ההשקעות')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestments()
  }, [])

  const totalInvestments = investments.reduce((sum, investment) => sum + investment.currentValue, 0)
  const totalInitial = investments.reduce((sum, investment) => sum + investment.initialAmount, 0)
  const totalReturn = totalInvestments - totalInitial
  const averageReturn = totalInitial > 0 ? (totalReturn / totalInitial * 100) : 0

  // Note: filteredTotalValue and filteredCount can be used for displaying filtered statistics if needed

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">{t('loadingInvestments')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">{t('investmentManagement')}</h1>
          <p className="text-slate-400">{t('manageAllInvestments')}</p>
        </div>
        <Link href="/investments/new">
          <Button className="btn-primary">
            <PlusCircle className="h-4 w-4 ml-2" />
            {t('addInvestment')}
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{t('totalInvestments')}</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalInvestments)}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{t('initialAmount')}</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalInitial)}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">רווח כולל</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalReturn)}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">תשואה ממוצעת</p>
                <p className="text-2xl font-bold text-white">{averageReturn.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder={t('searchInvestments')}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={filterOptions}
        filterValues={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        className="mb-6"
      />

      <Card className="card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{t('allInvestments')}</CardTitle>
            <div className="text-sm text-slate-400">
              {t('showing')} {filteredInvestments.length} {t('of')} {investments.length} {t('investments').toLowerCase()}
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {/* Investments Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">שם ההשקעה</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">סוג</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">ערך נוכחי</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">השקעה ראשונית</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">רווח/הפסד</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">תשואה</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center">
                      <div className="text-slate-400">
                        {investments.length === 0 ? (
                          <div>
                            <p className="mb-2">אין השקעות להצגה</p>
                            <Link href="/investments/new">
                              <Button className="btn-primary">
                                <PlusCircle className="h-4 w-4 ml-2" />
                                הוסף השקעה ראשונה
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div>
                            <p className="mb-2">לא נמצאו השקעות המתאימות לקריטריונים</p>
                            <Button
                              variant="outline"
                              onClick={clearFilters}
                              className="btn-secondary"
                            >
                              נקה סינון
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((investment) => {
                  const profit = investment.currentValue - investment.initialAmount
                  const returnRate = (profit / investment.initialAmount * 100)
                  
                  return (
                    <tr key={investment.id} className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{investment.name}</p>
                          <p className="text-sm text-slate-400">{formatDate(new Date(investment.date))}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[investment.type as keyof typeof typeColors]}`}>
                          {typeLabels[investment.type as keyof typeof typeLabels]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">{formatCurrency(investment.currentValue)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300">{formatCurrency(investment.initialAmount)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${returnRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {returnRate >= 0 ? '+' : ''}{returnRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/investments/${investment.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/investments/${investment.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 