"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Download
} from 'lucide-react'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { PropertyDistributionChart } from '@/components/charts/PropertyDistributionChart'
import { AssetAllocationChart } from '@/components/charts/AssetAllocationChart'
import { PerformanceComparisonChart } from '@/components/charts/PerformanceComparisonChart'
import { CashFlowAnalysis } from '@/components/reports/CashFlowAnalysis'
import { FinancialInsights } from '@/components/reports/FinancialInsights'

// Data interfaces
interface AnalyticsData {
  summary: {
    netWorth: number
    totalAssets: number
    totalDebt: number
    monthlyCashFlow: number
    debtToEquityRatio: number
  }
  performance: {
    properties: Array<Record<string, unknown>>
    investments: Array<Record<string, unknown>>
  }
  cashFlow: {
    incomeByCategory: Record<string, number>
    expensesByCategory: Record<string, number>
    monthly: {
      income: Record<string, number>
      expenses: Record<string, number>
      rental: Record<string, number>
    }
  }
  allocation: {
    properties: { value: number; percentage: number }
    investments: { value: number; percentage: number }
  }
  timeRange: string
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('6m')
  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'json' | 'csv' = 'json') => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeRange,
          format
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `financial-report-${timeRange}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  // Prepare chart data
  const prepareMonthlyData = () => {
    if (!analyticsData) return []
    
    const months = Object.keys(analyticsData.cashFlow.monthly.income).sort()
    return months.map(month => {
      const income = analyticsData.cashFlow.monthly.income[month] || 0
      const expenses = analyticsData.cashFlow.monthly.expenses[month] || 0
      const profit = income - expenses
      
      return {
        month: month.substring(5), // Extract month from YYYY-MM format
        income,
        expenses,
        profit
      }
    })
  }

  const prepareAssetAllocationData = () => {
    if (!analyticsData) return []
    
    return [
      {
        name: 'נדל״ן',
        value: analyticsData.allocation.properties.value,
        color: '#3b82f6',
        percentage: analyticsData.allocation.properties.percentage
      },
      {
        name: 'השקעות',
        value: analyticsData.allocation.investments.value,
        color: '#10b981',
        percentage: analyticsData.allocation.investments.percentage
      }
    ]
  }

  const prepareExpenseCategoryData = () => {
    if (!analyticsData) return []
    
    return Object.entries(analyticsData.cashFlow.expensesByCategory)
      .map(([category, value]) => ({
        name: category,
        value,
        color: getRandomColor()
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">דוחות וניתוח</h1>
          <p className="text-slate-400">ניתוח מעמיק של המצב הפיננסי שלך</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="1m">חודש</SelectItem>
              <SelectItem value="3m">3 חודשים</SelectItem>
              <SelectItem value="6m">6 חודשים</SelectItem>
              <SelectItem value="1y">שנה</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button onClick={() => handleExport('json')} className="btn-secondary">
              <Download className="h-4 w-4 ml-2" />
              JSON
            </Button>
            <Button onClick={() => handleExport('csv')} className="btn-secondary">
              <Download className="h-4 w-4 ml-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">שווי נטו</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? 'טוען...' : analyticsData ? formatCurrency(analyticsData.summary.netWorth) : '₪0'}
                </p>
                <div className="flex items-center gap-1 mt-1 text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">עדכני</span>
                </div>
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
                <p className="text-sm text-slate-400 mb-1">סך נכסים</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? 'טוען...' : analyticsData ? formatCurrency(analyticsData.summary.totalAssets) : '₪0'}
                </p>
                <div className="flex items-center gap-1 mt-1 text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">סך הכל</span>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">סך חובות</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? 'טוען...' : analyticsData ? formatCurrency(analyticsData.summary.totalDebt) : '₪0'}
                </p>
                <div className="flex items-center gap-1 mt-1 text-red-400">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">חובות</span>
                </div>
              </div>
              <div className="p-3 bg-red-500 rounded-lg">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">תזרים מזומנים</p>
                <p className={`text-2xl font-bold ${(analyticsData?.summary.monthlyCashFlow ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {loading ? 'טוען...' : analyticsData ? formatCurrency(analyticsData.summary.monthlyCashFlow) : '₪0'}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${(analyticsData?.summary.monthlyCashFlow ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(analyticsData?.summary.monthlyCashFlow ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">חודשי</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${(analyticsData?.summary.monthlyCashFlow ?? 0) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">תזרים מזומנים חודשי</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">טוען נתונים...</p>
              </div>
            ) : (
              <MonthlyChart data={prepareMonthlyData()} />
            )}
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">התפלגות נכסים</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">טוען נתונים...</p>
              </div>
            ) : (
              <AssetAllocationChart data={prepareAssetAllocationData()} title="" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      {analyticsData && analyticsData.performance.properties.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">ניתוח ביצועי נדל״ן</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceComparisonChart 
              data={analyticsData.performance.properties} 
              title="ביצועי נכסי נדל״ן" 
            />
          </CardContent>
        </Card>
      )}

      {/* Cash Flow Analysis */}
      {analyticsData && (
        <CashFlowAnalysis data={analyticsData.cashFlow} />
      )}

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">טוען נתונים...</p>
              </div>
            ) : (
              <PropertyDistributionChart 
                data={prepareAssetAllocationData()} 
                title="התפלגות נכסים" 
              />
            )}
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-400">טוען נתונים...</p>
              </div>
            ) : (
              <PropertyDistributionChart 
                data={prepareExpenseCategoryData()} 
                title="התפלגות הוצאות" 
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Insights */}
      {analyticsData && (
        <FinancialInsights 
          netWorth={analyticsData.summary.netWorth}
          monthlyCashFlow={analyticsData.summary.monthlyCashFlow}
          debtToEquityRatio={analyticsData.summary.debtToEquityRatio}
          propertyPerformance={analyticsData.performance.properties}
          investmentPerformance={analyticsData.performance.investments}
        />
      )}
    </div>
  )
} 