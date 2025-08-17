"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  PlusCircle, Search, Filter, Edit, Trash2, Eye, DollarSign, Calendar, FileText
} from 'lucide-react'

interface Expense {
  id: string
  category: string
  amount: number
  date: string
  description?: string
  createdAt: string
}

const categoryLabels = {
  living: 'משק בית',
  transportation: 'תחבורה',
  healthcare: 'בריאות',
  entertainment: 'בילויים',
  education: 'חינוך',
  shopping: 'קניות',
  utilities: 'חשבונות',
  insurance: 'ביטוח',
  taxes: 'מיסים',
  other: 'אחר',
}

const categoryColors = {
  living: 'bg-blue-100 text-blue-800',
  transportation: 'bg-green-100 text-green-800',
  healthcare: 'bg-red-100 text-red-800',
  entertainment: 'bg-purple-100 text-purple-800',
  education: 'bg-indigo-100 text-indigo-800',
  shopping: 'bg-pink-100 text-pink-800',
  utilities: 'bg-orange-100 text-orange-800',
  insurance: 'bg-yellow-100 text-yellow-800',
  taxes: 'bg-gray-100 text-gray-800',
  other: 'bg-slate-100 text-slate-800',
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/expenses')
        if (!response.ok) {
          throw new Error('Failed to fetch expenses')
        }
        const data = await response.json()
        setExpenses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      const currentDate = new Date()
      return expenseDate.getMonth() === currentDate.getMonth() && 
             expenseDate.getFullYear() === currentDate.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול הוצאות</h1>
          <p className="text-slate-400">טוען נתונים...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול הוצאות</h1>
          <p className="text-red-400">שגיאה בטעינת הנתונים: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול הוצאות</h1>
          <p className="text-slate-400">ניהול כל ההוצאות שלך</p>
        </div>
        <Link href="/expenses/new">
          <Button className="btn-primary">
            <PlusCircle className="h-4 w-4 ml-2" />
            הוסף הוצאה חדשה
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">סך הוצאות</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-3 bg-red-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">הוצאות חודשיות</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(monthlyExpenses)}</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
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
                <p className="text-2xl font-bold text-white">{expenses.length}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">כל ההוצאות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="חיפוש הוצאות..."
                className="pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button variant="outline" className="btn-secondary">
              <Filter className="h-4 w-4 ml-2" />
              סינון
            </Button>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">קטגוריה</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">סכום</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">תאריך</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">תיאור</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center">
                      <p className="text-slate-400">אין הוצאות להצגה</p>
                      <Link href="/expenses/new">
                        <Button className="mt-2 btn-primary">
                          <PlusCircle className="h-4 w-4 ml-2" />
                          הוסף הוצאה ראשונה
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category as keyof typeof categoryColors]}`}>
                          {categoryLabels[expense.category as keyof typeof categoryLabels]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-red-400 font-medium">{formatCurrency(expense.amount)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300">{formatDate(new Date(expense.date))}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300 text-sm">{expense.description || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/expenses/${expense.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/expenses/${expense.id}/edit`}>
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