import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  PlusCircle, Search, Filter, Edit, Trash2, Eye, DollarSign, Calendar, FileText
} from 'lucide-react'

// Mock data for demonstration
const mockExpenses = [
  {
    id: '1',
    category: 'household',
    amount: 8000,
    date: new Date('2024-07-05'),
    description: 'הוצאות משק בית - קניות שבועיות',
  },
  {
    id: '2',
    category: 'insurance',
    amount: 3000,
    date: new Date('2024-07-10'),
    description: 'ביטוח רכב שנתי',
  },
  {
    id: '3',
    category: 'transportation',
    amount: 2500,
    date: new Date('2024-07-15'),
    description: 'דלק וחנייה',
  },
  {
    id: '4',
    category: 'healthcare',
    amount: 1200,
    date: new Date('2024-07-12'),
    description: 'ביטוח בריאות ותרופות',
  },
  {
    id: '5',
    category: 'entertainment',
    amount: 3000,
    date: new Date('2024-07-18'),
    description: 'בילויים ומסעדות',
  },
  {
    id: '6',
    category: 'utilities',
    amount: 1500,
    date: new Date('2024-07-20'),
    description: 'חשבונות חשמל ומים',
  },
]

const categoryLabels = {
  household: 'משק בית',
  transportation: 'תחבורה',
  healthcare: 'בריאות',
  entertainment: 'בילויים',
  insurance: 'ביטוח',
  utilities: 'חשבונות',
  education: 'חינוך',
  other: 'אחר',
}

const categoryColors = {
  household: 'bg-blue-100 text-blue-800',
  transportation: 'bg-green-100 text-green-800',
  healthcare: 'bg-red-100 text-red-800',
  entertainment: 'bg-purple-100 text-purple-800',
  insurance: 'bg-yellow-100 text-yellow-800',
  utilities: 'bg-orange-100 text-orange-800',
  education: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
}

export default function ExpensesPage() {
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyExpenses = mockExpenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      const currentDate = new Date()
      return expenseDate.getMonth() === currentDate.getMonth() && 
             expenseDate.getFullYear() === currentDate.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

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
                <p className="text-2xl font-bold text-white">{mockExpenses.length}</p>
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
                {mockExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-600 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category]}`}>
                        {categoryLabels[expense.category]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-red-400 font-medium">{formatCurrency(expense.amount)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300">{formatDate(expense.date)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300 text-sm">{expense.description}</span>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 