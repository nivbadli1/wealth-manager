"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { formatCurrency } from '@/lib/utils'
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, 
  DollarSign, PieChart, BarChart3, Shield 
} from 'lucide-react'

interface FinancialInsightsProps {
  netWorth: number
  monthlyCashFlow: number
  debtToEquityRatio: number
  propertyPerformance: Array<Record<string, unknown>>
  investmentPerformance: Array<Record<string, unknown>>
}

export function FinancialInsights({ 
  monthlyCashFlow, 
  debtToEquityRatio, 
  propertyPerformance, 
  investmentPerformance 
}: FinancialInsightsProps) {
  
  // Calculate insights
  const isHealthyCashFlow = monthlyCashFlow > 0
  const isHealthyDebtRatio = debtToEquityRatio < 0.4
  const avgPropertyROI = propertyPerformance.length > 0 
    ? propertyPerformance.reduce((sum, prop) => sum + ((prop as Record<string, unknown>).roi as number || 0), 0) / propertyPerformance.length 
    : 0
  // const avgInvestmentROI = investmentPerformance.length > 0 
  //   ? investmentPerformance.reduce((sum, inv) => sum + (inv.roi || 0), 0) / investmentPerformance.length 
  //   : 0

  const insights = [
    {
      type: isHealthyCashFlow ? 'positive' : 'negative',
      icon: isHealthyCashFlow ? CheckCircle : AlertTriangle,
      title: isHealthyCashFlow ? 'תזרים מזומנים חיובי' : 'תזרים מזומנים שלילי',
      description: isHealthyCashFlow 
        ? 'תזרים המזומנים החיובי שלך מאפשר השקעות נוספות וצבירת עושר. המשך לנהל את ההכנסות והוצאות ביעילות.'
        : 'תזרים המזומנים השלילי דורש תשומת לב מיידית. בדוק את ההוצאות ושקול דרכים להגדלת ההכנסות.',
      color: isHealthyCashFlow ? 'green' : 'red'
    },
    {
      type: isHealthyDebtRatio ? 'positive' : 'warning',
      icon: isHealthyDebtRatio ? CheckCircle : AlertTriangle,
      title: isHealthyDebtRatio ? 'יחס חוב בריא' : 'יחס חוב גבוה',
      description: isHealthyDebtRatio
        ? `יחס החוב שלך (${(debtToEquityRatio * 100).toFixed(1)}%) נמצא ברמה בריאה. זה מעיד על ניהול פיננסי טוב.`
        : `יחס החוב שלך (${(debtToEquityRatio * 100).toFixed(1)}%) גבוה מהמומלץ. שקול להקטין חובות או להגדיל נכסים.`,
      color: isHealthyDebtRatio ? 'green' : 'yellow'
    },
    {
      type: avgPropertyROI > 8 ? 'positive' : avgPropertyROI > 5 ? 'neutral' : 'warning',
      icon: avgPropertyROI > 8 ? TrendingUp : avgPropertyROI > 5 ? Target : TrendingDown,
      title: avgPropertyROI > 8 ? 'ביצועי נדל״ן מצוינים' : avgPropertyROI > 5 ? 'ביצועי נדל״ן טובים' : 'ביצועי נדל״ן נמוכים',
      description: avgPropertyROI > 8 
        ? `תשואה ממוצעת של ${avgPropertyROI.toFixed(1)}% על נכסי הנדל״ן מעולה. המשך לנהל את הנכסים ביעילות.`
        : avgPropertyROI > 5 
        ? `תשואה ממוצעת של ${avgPropertyROI.toFixed(1)}% על נכסי הנדל״ן סבירה. שקול דרכים לשיפור התשואה.`
        : `תשואה ממוצעת של ${avgPropertyROI.toFixed(1)}% על נכסי הנדל״ן נמוכה. בדוק אפשרויות לשיפור או מכירה.`,
      color: avgPropertyROI > 8 ? 'green' : avgPropertyROI > 5 ? 'blue' : 'yellow'
    }
  ]

  const recommendations = [
    {
      priority: 'high',
      icon: Target,
      title: 'הגדל קרן חירום',
      description: 'וודא שיש לך לפחות 6 חודשי הוצאות בקרן חירום לביטחון פיננסי.',
      color: 'blue'
    },
    {
      priority: 'medium',
      icon: PieChart,
      title: 'גיוון תיק השקעות',
      description: 'שקול להוסיף השקעות בינלאומיות ובמגזרים שונים לגיוון נוסף.',
      color: 'purple'
    },
    {
      priority: 'medium',
      icon: BarChart3,
      title: 'מעקב ביצועים',
      description: 'עקב אחר ביצועי ההשקעות באופן קבוע והתאם את האסטרטגיה בהתאם.',
      color: 'green'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return { bg: 'bg-green-500', text: 'text-green-400' }
      case 'red': return { bg: 'bg-red-500', text: 'text-red-400' }
      case 'yellow': return { bg: 'bg-yellow-500', text: 'text-yellow-400' }
      case 'blue': return { bg: 'bg-blue-500', text: 'text-blue-400' }
      case 'purple': return { bg: 'bg-purple-500', text: 'text-purple-400' }
      default: return { bg: 'bg-gray-500', text: 'text-gray-400' }
    }
  }

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
                <span className="text-2xl font-bold text-white">
                  {Math.max(50, Math.min(100, 
                    50 + 
                    (isHealthyCashFlow ? 15 : -15) +
                    (isHealthyDebtRatio ? 15 : -10) +
                    (avgPropertyROI > 8 ? 20 : avgPropertyROI > 5 ? 10 : 0)
                  ))}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-2">ציון כללי</h3>
              <p className="text-slate-400 text-sm">
                {isHealthyCashFlow && isHealthyDebtRatio ? 'מצוין' : 
                 isHealthyCashFlow || isHealthyDebtRatio ? 'טוב' : 'דורש שיפור'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {Math.max(60, Math.min(100, 60 + avgPropertyROI * 4))}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-2">ציון נדל״ן</h3>
              <p className="text-slate-400 text-sm">
                {avgPropertyROI > 8 ? 'מצוין' : avgPropertyROI > 5 ? 'טוב' : 'בסיסי'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {Math.max(50, Math.min(100, 50 + (isHealthyCashFlow ? 25 : 0) + (isHealthyDebtRatio ? 25 : 0)))}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-2">ציון יציבות</h3>
              <p className="text-slate-400 text-sm">
                {isHealthyCashFlow && isHealthyDebtRatio ? 'יציב מאוד' : 'יציב'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">תובנות מפתח</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const colors = getColorClasses(insight.color)
              const Icon = insight.icon
              
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-700 rounded-lg">
                  <div className={`p-2 ${colors.bg} rounded-lg mt-1`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
                    <p className="text-slate-300 text-sm">{insight.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">המלצות לשיפור</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const colors = getColorClasses(rec.color)
              const Icon = rec.icon
              
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-700 rounded-lg">
                  <div className={`p-2 ${colors.bg} rounded-lg mt-1`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{rec.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-500 text-white' :
                        rec.priority === 'medium' ? 'bg-yellow-500 text-black' :
                        'bg-green-500 text-white'
                      }`}>
                        {rec.priority === 'high' ? 'דחוף' : 
                         rec.priority === 'medium' ? 'חשוב' : 'רצוי'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{rec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">סיכום פיננסי</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700 rounded-lg text-center">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm mb-1">רמת סיכון</p>
              <p className="text-white font-semibold">
                {isHealthyDebtRatio && isHealthyCashFlow ? 'נמוכה' : 
                 isHealthyDebtRatio || isHealthyCashFlow ? 'בינונית' : 'גבוהה'}
              </p>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm mb-1">פוטנציאל צמיחה</p>
              <p className="text-white font-semibold">
                {monthlyCashFlow > 10000 ? 'גבוה' : monthlyCashFlow > 0 ? 'בינוני' : 'נמוך'}
              </p>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-lg text-center">
              <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm mb-1">יציבות הכנסה</p>
              <p className="text-white font-semibold">
                {propertyPerformance.length > 2 ? 'יציבה' : 'בינונית'}
              </p>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-lg text-center">
              <BarChart3 className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm mb-1">גיוון השקעות</p>
              <p className="text-white font-semibold">
                {investmentPerformance.length > 0 && propertyPerformance.length > 0 ? 'מגוון' : 'בסיסי'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}