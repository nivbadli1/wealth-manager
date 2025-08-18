"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { SearchAndFilter, FilterOption } from '@/components/ui/SearchAndFilter'
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter'
import Link from 'next/link'
import {
  PlusCircle, Edit, Trash2, Eye, DollarSign, Calendar, FileText
} from 'lucide-react'

interface Income {
  id: string
  source: string
  amount: number
  date: string
  category: string
  description?: string
}

// Mock data for demonstration
// const mockIncome = [
//   {
//     id: '1',
//     source: 'משכורת חודשית',
//     amount: 15000,
//     date: new Date('2024-07-01'),
//     category: 'salary',
//     description: 'משכורת חודשית מחברת היי-טק',
//   },
//   {
//     id: '2',
//     source: 'הכנסה מהשקעות',
//     amount: 5000,
//     date: new Date('2024-07-15'),
//     category: 'investment',
//     description: 'דיבידנדים ממניות',
//   },
//   {
//     id: '3',
//     source: 'פרויקט ייעוץ',
//     amount: 8000,
//     date: new Date('2024-07-10'),
//     category: 'freelance',
//     description: 'ייעוץ לחברת סטארט-אפ',
//   },
//   {
//     id: '4',
//     source: 'דמי שכירות',
//     amount: 12000,
//     date: new Date('2024-07-01'),
//     category: 'rental',
//     description: 'דמי שכירות נכסים',
//   },
//   {
//     id: '5',
//     source: 'הכנסה נוספת',
//     amount: 3000,
//     date: new Date('2024-07-20'),
//     category: 'other',
//     description: 'הכנסה ממכירת ציוד',
//   },
// ]

const categoryLabels = {
  salary: 'משכורת',
  investment: 'השקעות',
  freelance: 'פרילנס',
  rental: 'שכירות',
  dividends: 'דיבידנדים',
  other: 'אחר',
}

const categoryColors = {
  salary: 'bg-blue-100 text-blue-800',
  investment: 'bg-green-100 text-green-800',
  freelance: 'bg-purple-100 text-purple-800',
  rental: 'bg-orange-100 text-orange-800',
  dividends: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
}

const filterOptions: FilterOption[] = [
  {
    key: 'category',
    label: 'קטגוריה',
    type: 'multiselect',
    options: [
      { value: 'salary', label: 'משכורת' },
      { value: 'investment', label: 'השקעות' },
      { value: 'freelance', label: 'פרילנס' },
      { value: 'rental', label: 'שכירות' },
      { value: 'dividends', label: 'דיבידנדים' },
      { value: 'other', label: 'אחר' }
    ]
  },
  {
    key: 'date',
    label: 'תאריך',
    type: 'dateRange'
  },
  {
    key: 'amount',
    label: 'סכום',
    type: 'numberRange'
  }
]

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData: filteredIncome
  } = useSearchAndFilter({
    data: income,
    searchFields: ['source', 'description', 'category'],
    initialFilters: {}
  })

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch('/api/income')
        if (!response.ok) {
          throw new Error('Failed to fetch income')
        }
        const data = await response.json()
        setIncome(data)
      } catch (error) {
        console.error('Error fetching income:', error)
        setError('שגיאה בטעינת ההכנסות')
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncome()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">טוען הכנסות...</div>
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

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0)
  const monthlyIncome = income
    .filter(inc => {
      const incomeDate = new Date(inc.date)
      const currentDate = new Date()
      return incomeDate.getMonth() === currentDate.getMonth() && 
             incomeDate.getFullYear() === currentDate.getFullYear()
    })
    .reduce((sum, inc) => sum + inc.amount, 0)

  // Filtered statistics for display
  const filteredTotalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0)
  const filteredCount = filteredIncome.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול הכנסות</h1>
          <p className="text-slate-400">ניהול כל ההכנסות שלך</p>
        </div>
        <Link href="/income/new">
          <Button className="btn-primary">
            <PlusCircle className="h-4 w-4 ml-2" />
            הוסף הכנסה חדשה
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">סך הכנסות</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">הכנסה חודשית</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(monthlyIncome)}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">מספר רשומות</p>
                <p className="text-2xl font-bold text-white">{income.length}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="חיפוש הכנסות לפי מקור, תיאור או קטגוריה..."
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
            <CardTitle className="text-white">כל ההכנסות</CardTitle>
            <div className="text-sm text-slate-400">
              מציג {filteredIncome.length} מתוך {income.length} הכנסות
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {/* Income Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">מקור</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">קטגוריה</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">סכום</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">תאריך</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">תיאור</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncome.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center">
                      <div className="text-slate-400">
                        {income.length === 0 ? (
                          <div>
                            <p className="mb-2">אין הכנסות להצגה</p>
                            <Link href="/income/new">
                              <Button className="btn-primary">
                                <PlusCircle className="h-4 w-4 ml-2" />
                                הוסף הכנסה ראשונה
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div>
                            <p className="mb-2">לא נמצאו הכנסות המתאימות לקריטריונים</p>
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
                  filteredIncome.map((incomeItem) => (
                  <tr key={incomeItem.id} className="border-b border-slate-600 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-white">{incomeItem.source}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[incomeItem.category as keyof typeof categoryColors]}`}>
                        {categoryLabels[incomeItem.category as keyof typeof categoryLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-medium">{formatCurrency(incomeItem.amount)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300">{formatDate(new Date(incomeItem.date))}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300 text-sm">{incomeItem.description}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/income/${incomeItem.id}`}>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/income/${incomeItem.id}/edit`}>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 