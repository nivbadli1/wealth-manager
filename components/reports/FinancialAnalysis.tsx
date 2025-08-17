"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react'

interface FinancialAnalysisProps {
  data: {
    netWorth: number
    monthlyIncome: number
    monthlyExpenses: number
    cashFlow: number
    savingsRate: number
    debtToIncome: number
    emergencyFund: number
    investmentAllocation: {
      properties: number
      stocks: number
      bonds: number
      cash: number
    }
  }
}

export function FinancialAnalysis({ data }: FinancialAnalysisProps) {
  const getSavingsRateStatus = (rate: number) => {
    if (rate >= 20) return { status: 'excellent', color: 'text-green-400', icon: CheckCircle }
    if (rate >= 15) return { status: 'good', color: 'text-blue-400', icon: CheckCircle }
    if (rate >= 10) return { status: 'fair', color: 'text-yellow-400', icon: AlertTriangle }
    return { status: 'poor', color: 'text-red-400', icon: AlertTriangle }
  }

  const getDebtToIncomeStatus = (ratio: number) => {
    if (ratio <= 0.28) return { status: 'excellent', color: 'text-green-400', icon: CheckCircle }
    if (ratio <= 0.36) return { status: 'good', color: 'text-blue-400', icon: CheckCircle }
    if (ratio <= 0.43) return { status: 'fair', color: 'text-yellow-400', icon: AlertTriangle }
    return { status: 'poor', color: 'text-red-400', icon: AlertTriangle }
  }

  const savingsRateStatus = getSavingsRateStatus(data.savingsRate)
  const debtToIncomeStatus = getDebtToIncomeStatus(data.debtToIncome)

  return (
    <div className="space-y-6">
      {/* Financial Health Score */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">ציון בריאות פיננסית</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">85</span>
              </div>
              <h3 className="text-white font-semibold mb-2">ציון כללי</h3>
              <p className="text-slate-400 text-sm">מצוין - מצב פיננסי יציב</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">92</span>
              </div>
              <h3 className="text-white font-semibold mb-2">ציון השקעות</h3>
              <p className="text-slate-400 text-sm">מצוין - גיוון טוב</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">78</span>
              </div>
              <h3 className="text-white font-semibold mb-2">ציון חיסכון</h3>
              <p className="text-slate-400 text-sm">טוב - יכול להשתפר</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">יחסי פיננסיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-slate-300">יחס חיסכון</p>
                <p className="text-sm text-slate-400">אחוז מההכנסה שנחסך</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${savingsRateStatus.color}`}>
                  {data.savingsRate}%
                </p>
                <div className="flex items-center gap-1">
                  <savingsRateStatus.icon className={`h-4 w-4 ${savingsRateStatus.color}`} />
                  <span className={`text-sm ${savingsRateStatus.color}`}>
                    {savingsRateStatus.status === 'excellent' ? 'מצוין' : 
                     savingsRateStatus.status === 'good' ? 'טוב' : 
                     savingsRateStatus.status === 'fair' ? 'הוגן' : 'נמוך'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-slate-300">יחס חוב להכנסה</p>
                <p className="text-sm text-slate-400">רמת החוב ביחס להכנסה</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${debtToIncomeStatus.color}`}>
                  {(data.debtToIncome * 100).toFixed(1)}%
                </p>
                <div className="flex items-center gap-1">
                  <debtToIncomeStatus.icon className={`h-4 w-4 ${debtToIncomeStatus.color}`} />
                  <span className={`text-sm ${debtToIncomeStatus.color}`}>
                    {debtToIncomeStatus.status === 'excellent' ? 'מצוין' : 
                     debtToIncomeStatus.status === 'good' ? 'טוב' : 
                     debtToIncomeStatus.status === 'fair' ? 'הוגן' : 'גבוה'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-slate-300">קרן חירום</p>
                <p className="text-sm text-slate-400">חודשי הוצאות מכוסים</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  {data.emergencyFund.toFixed(1)}x
                </p>
                <p className="text-sm text-slate-400">
                  {data.emergencyFund >= 6 ? 'מצוין' : data.emergencyFund >= 3 ? 'טוב' : 'נמוך'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">הקצאת השקעות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-slate-300">נדל״ן</span>
                </div>
                <span className="text-white font-medium">{data.investmentAllocation.properties}%</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${data.investmentAllocation.properties}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-slate-300">מניות</span>
                </div>
                <span className="text-white font-medium">{data.investmentAllocation.stocks}%</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${data.investmentAllocation.stocks}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-slate-300">אגרות חוב</span>
                </div>
                <span className="text-white font-medium">{data.investmentAllocation.bonds}%</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${data.investmentAllocation.bonds}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-slate-300">מזומן</span>
                </div>
                <span className="text-white font-medium">{data.investmentAllocation.cash}%</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${data.investmentAllocation.cash}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">המלצות פיננסיות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-slate-700 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg mt-1">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">מצוין! תזרים מזומנים חיובי</h3>
                <p className="text-slate-300 text-sm">
                  תזרים המזומנים החיובי שלך מאפשר לך להמשיך להשקיע ולצבור עושר. שקול להגדיל את החיסכון החודשי.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-700 rounded-lg">
              <div className="p-2 bg-blue-500 rounded-lg mt-1">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">הגדל את קרן החירום</h3>
                <p className="text-slate-300 text-sm">
                  מומלץ להגדיל את קרן החירום ל-6 חודשי הוצאות לפחות. זה ייתן לך ביטחון פיננסי נוסף.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-700 rounded-lg">
              <div className="p-2 bg-purple-500 rounded-lg mt-1">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">גיוון השקעות</h3>
                <p className="text-slate-300 text-sm">
                  תיק ההשקעות שלך מגוון היטב. שקול להוסיף השקעות בינלאומיות לגיוון נוסף.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 