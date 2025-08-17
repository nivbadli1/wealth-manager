import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  PlusCircle, Search, Filter, Edit, Trash2, Eye, DollarSign, FileText, PiggyBank
} from 'lucide-react'

// Mock data for demonstration
const mockInvestments = [
  {
    id: '1',
    type: 'stocks',
    name: 'תיק השקעות מניות',
    initialAmount: 500000,
    currentValue: 580000,
    date: new Date('2023-05-10'),
    returnRate: 16.0,
  },
  {
    id: '2',
    type: 'mutual_fund',
    name: 'קרן נאמנות',
    initialAmount: 300000,
    currentValue: 320000,
    date: new Date('2023-08-15'),
    returnRate: 6.7,
  },
  {
    id: '3',
    type: 'pension',
    name: 'קופת גמל פסגות',
    initialAmount: 150000,
    currentValue: 185000,
    date: new Date('2018-01-01'),
    returnRate: 7.2,
  },
  {
    id: '4',
    type: 'study_fund',
    name: 'קרן השתלמות כלל',
    initialAmount: 80000,
    currentValue: 95000,
    date: new Date('2019-06-01'),
    returnRate: 5.8,
  },
  {
    id: '5',
    type: 'savings',
    name: 'חיסכון בנקאי',
    initialAmount: 100000,
    currentValue: 105000,
    date: new Date('2021-01-01'),
    returnRate: 1.8,
  },
]

const typeLabels = {
  stocks: 'מניות',
  mutual_fund: 'קרן נאמנות',
  pension: 'קופת גמל',
  study_fund: 'קרן השתלמות',
  savings: 'חיסכון',
  bonds: 'אגרות חוב',
  crypto: 'קריפטו',
  other: 'אחר',
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
  const totalInvestments = mockInvestments.reduce((sum, investment) => sum + investment.currentValue, 0)
  const totalInitial = mockInvestments.reduce((sum, investment) => sum + investment.initialAmount, 0)
  const totalReturn = totalInvestments - totalInitial
  const averageReturn = totalInitial > 0 ? (totalReturn / totalInitial * 100) : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול השקעות</h1>
          <p className="text-slate-400">ניהול כל ההשקעות הפיננסיות שלך</p>
        </div>
        <Link href="/investments/new">
          <Button className="btn-primary">
            <PlusCircle className="h-4 w-4 ml-2" />
            הוסף השקעה חדשה
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">סך השקעות</p>
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
                <p className="text-sm text-slate-400 mb-1">השקעה ראשונית</p>
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
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">כל ההשקעות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="חיפוש השקעות..."
                className="pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button variant="outline" className="btn-secondary">
              <Filter className="h-4 w-4 ml-2" />
              סינון
            </Button>
          </div>

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
                {mockInvestments.map((investment) => {
                  const profit = investment.currentValue - investment.initialAmount
                  const returnRate = (profit / investment.initialAmount * 100)
                  
                  return (
                    <tr key={investment.id} className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{investment.name}</p>
                          <p className="text-sm text-slate-400">{formatDate(investment.date)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[investment.type]}`}>
                          {typeLabels[investment.type]}
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
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 