"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import {
  TrendingUp, Building2, LandPlot, PiggyBank, Banknote, ReceiptText, PlusCircle
} from 'lucide-react'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { PropertyDistributionChart } from '@/components/charts/PropertyDistributionChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

interface DashboardData {
  kpi: {
    netWorth: number
    monthlyRentalIncome: number
    totalProperties: number
    totalInvestmentsValue: number
    monthlyExpenses: number
    rentedProperties: number
    monthlyGrowth: number
    propertyGrowth: number
    investmentGrowth: number
  }
  charts: {
    monthlyData: Array<{
      month: string
      income: number
      expenses: number
      profit: number
    }>
    propertyTypeDistribution: Record<string, number>
    propertyStatusDistribution: Record<string, number>
  }
  recentActivity: {
    properties: Array<{
      id: string
      name: string
      type: string
      action: string
      date: string
    }>
    income: Array<{
      id: string
      name: string
      type: string
      action: string
      date: string
    }>
    expenses: Array<{
      id: string
      name: string
      type: string
      action: string
      date: string
    }>
  }
}

interface KPICardProps {
  title: string
  value: number | string
  description: string
  icon: React.ComponentType
  trend?: {
    value: number
    isPositive: boolean
  }
  iconBgColor: string
  href?: string
}

function KPICard({ title, value, description, icon: Icon, trend, iconBgColor, href }: KPICardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link href={href} className="block">
          <Card className="kpi-card hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
            {children}
          </Card>
        </Link>
      )
    }
    return (
      <Card className="kpi-card">
        {children}
      </Card>
    )
  }

  return (
    <CardWrapper>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-bold text-slate-300 tracking-wide uppercase">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </div>
        <p className="text-sm text-slate-400 font-medium mb-3">{description}</p>
        {trend && (
          <div className={`text-sm font-bold flex items-center gap-2 ${trend.isPositive ? 'stat-increase' : 'stat-decrease'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </CardContent>
    </CardWrapper>
  )
}

function QuickActionCard({ title, description, icon: Icon, href }: {
  title: string
  description: string
  icon: React.ComponentType
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer group hover:bg-slate-700/50 transition-all duration-200">
        <CardContent className="flex items-center p-4">
          <div className="p-3 bg-slate-700 rounded-lg mr-4">
            <Icon className="h-6 w-6 text-slate-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">דשבורד נתונים פיננסיים</h1>
          <p className="text-slate-400">טוען נתונים...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="kpi-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/3"></div>
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">דשבורד נתונים פיננסיים</h1>
          <p className="text-red-400">שגיאה בטעינת הנתונים: {error}</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">דשבורד נתונים פיננסיים</h1>
          <p className="text-slate-400">אין נתונים זמינים</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const propertyTypeData = Object.entries(dashboardData.charts.propertyTypeDistribution).map(([key, value]) => ({
    name: key === 'apartment' ? 'דירה' : key === 'house' ? 'בית פרטי' : 'מסחרי',
    value,
    color: key === 'apartment' ? '#3b82f6' : key === 'house' ? '#10b981' : '#f59e0b'
  }))

  const propertyStatusData = Object.entries(dashboardData.charts.propertyStatusDistribution).map(([key, value]) => ({
    name: key === 'rented' ? 'מושכר' : key === 'vacant' ? 'פנוי' : 'בבעלות',
    value,
    color: key === 'rented' ? '#10b981' : key === 'vacant' ? '#f59e0b' : '#3b82f6'
  }))

  // Combine recent activities
  const allActivities = [
    ...dashboardData.recentActivity.properties.map(item => ({ 
      ...item, 
      type: 'property' as const,
      action: item.action as 'added' | 'updated' | 'deleted'
    })),
    ...dashboardData.recentActivity.income.map(item => ({ 
      ...item, 
      type: 'income' as const,
      action: item.action as 'added' | 'updated' | 'deleted'
    })),
    ...dashboardData.recentActivity.expenses.map(item => ({ 
      ...item, 
      type: 'expense' as const,
      action: item.action as 'added' | 'updated' | 'deleted'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">דשבורד נתונים פיננסיים</h1>
        <p className="text-slate-400">מבט כולל על הנכסים, ההכנסות וההשקעות שלך</p>
      </div>

      {/* KPI Cards Grid - EXACT h-40 height */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="הכנסה חודשית"
          value={dashboardData.kpi.monthlyRentalIncome}
          description="הכנסות שכירות חודשיות"
          icon={Banknote}
          trend={{ value: dashboardData.kpi.monthlyGrowth, isPositive: true }}
          iconBgColor="bg-blue-500"
          href="/income"
        />
        <KPICard
          title="סך הנכסים"
          value={dashboardData.kpi.netWorth}
          description="שווי נטו כולל"
          icon={Building2}
          trend={{ value: dashboardData.kpi.propertyGrowth, isPositive: true }}
          iconBgColor="bg-green-500"
          href="/properties"
        />
        <KPICard
          title="נכסים"
          value={dashboardData.kpi.totalProperties}
          description="מספר נכסים בבעלות"
          icon={LandPlot}
          trend={{ value: dashboardData.kpi.propertyGrowth, isPositive: true }}
          iconBgColor="bg-orange-500"
          href="/properties"
        />
        <KPICard
          title="השקעות"
          value={dashboardData.kpi.totalInvestmentsValue}
          description="סך ההשקעות הפיננסיות"
          icon={PiggyBank}
          trend={{ value: dashboardData.kpi.investmentGrowth, isPositive: true }}
          iconBgColor="bg-purple-500"
          href="/investments"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">הכנסות והוצאות חודשיות</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={dashboardData.charts.monthlyData} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card">
            <CardContent className="p-6">
              <PropertyDistributionChart 
                data={propertyTypeData} 
                title="התפלגות סוגי נכסים" 
              />
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <PropertyDistributionChart 
                data={propertyStatusData} 
                title="סטטוס נכסים" 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="הוסף נכס חדש"
            description="הוסף נכס נדל״ן חדש למערכת"
            icon={PlusCircle}
            href="/properties/new"
          />
          <QuickActionCard
            title="הוסף הכנסה"
            description="תעד הכנסה חדשה"
            icon={Banknote}
            href="/income/new"
          />
          <QuickActionCard
            title="הוסף הוצאה"
            description="תעד הוצאה חדשה"
            icon={ReceiptText}
            href="/expenses/new"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={allActivities} />
    </div>
  )
}