"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'

interface CashFlowAnalysisProps {
  data: {
    incomeByCategory: Record<string, number>
    expensesByCategory: Record<string, number>
    monthly: {
      income: Record<string, number>
      expenses: Record<string, number>
      rental: Record<string, number>
    }
  }
}

export function CashFlowAnalysis({ data }: CashFlowAnalysisProps) {
  const totalIncome = Object.values(data.incomeByCategory).reduce((sum, value) => sum + value, 0)
  const totalExpenses = Object.values(data.expensesByCategory).reduce((sum, value) => sum + value, 0)
  const netCashFlow = totalIncome - totalExpenses

  // Get top income and expense categories
  const topIncomeCategories = Object.entries(data.incomeByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const topExpenseCategories = Object.entries(data.expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const getCategoryColor = (index: number) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    return colors[index % colors.length]
  }

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle className="text-white">ניתוח תזרים מזומנים</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-white font-semibold">סה״כ הכנסות</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-white font-semibold">סה״כ הוצאות</h3>
              </div>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg border-2 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${netCashFlow >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-white font-semibold">תזרים נטו</h3>
              </div>
              <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(netCashFlow)}
              </p>
            </div>
          </div>

          {/* Top Income Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              הכנסות לפי קטגוריה
            </h3>
            <div className="space-y-3">
              {topIncomeCategories.map(([category, amount], index) => {
                const percentage = (amount / totalIncome) * 100
                return (
                  <div key={category} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{category}</span>
                      <span className="text-white font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(index)
                        }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-slate-400">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Expense Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              הוצאות לפי קטגוריה
            </h3>
            <div className="space-y-3">
              {topExpenseCategories.map(([category, amount], index) => {
                const percentage = (amount / totalExpenses) * 100
                return (
                  <div key={category} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{category}</span>
                      <span className="text-white font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(index)
                        }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-slate-400">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Cash Flow Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-semibold mb-2">יחס חיסכון</h4>
            <p className="text-slate-300 text-sm mb-2">
              אחוז ההכנסה שנשמר כחיסכון
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (netCashFlow / totalIncome) * 100)}%` }}
                />
              </div>
              <span className="text-green-400 font-medium">
                {((netCashFlow / totalIncome) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-semibold mb-2">יעילות הוצאות</h4>
            <p className="text-slate-300 text-sm mb-2">
              יחס ההוצאות מסך ההכנסות
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(totalExpenses / totalIncome) * 100}%` }}
                />
              </div>
              <span className="text-orange-400 font-medium">
                {((totalExpenses / totalIncome) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}