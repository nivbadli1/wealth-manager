"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Building2, DollarSign, ReceiptText, Clock } from 'lucide-react'

interface ActivityItem {
  id: string
  name: string
  type: 'property' | 'income' | 'expense'
  action: 'added' | 'updated' | 'deleted'
  date: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'property':
      return <Building2 className="h-4 w-4 text-blue-400" />
    case 'income':
      return <DollarSign className="h-4 w-4 text-green-400" />
    case 'expense':
      return <ReceiptText className="h-4 w-4 text-red-400" />
    default:
      return <Clock className="h-4 w-4 text-slate-400" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'property':
      return 'border-blue-500/20 bg-blue-500/10'
    case 'income':
      return 'border-green-500/20 bg-green-500/10'
    case 'expense':
      return 'border-red-500/20 bg-red-500/10'
    default:
      return 'border-slate-500/20 bg-slate-500/10'
  }
}

const getActionText = (action: string) => {
  switch (action) {
    case 'added':
      return 'נוסף'
    case 'updated':
      return 'עודכן'
    case 'deleted':
      return 'נמחק'
    default:
      return action
  }
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">פעילות אחרונה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">אין פעילות אחרונה להצגה</p>
            <p className="text-sm text-slate-500 mt-1">פעילות תוצג כאן לאחר שתתחיל להשתמש במערכת</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle className="text-white">פעילות אחרונה</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 8).map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {activity.name}
                </p>
                <p className="text-xs text-slate-400">
                  {getActionText(activity.action)} • {formatDate(new Date(activity.date))}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length > 8 && (
          <div className="mt-4 pt-4 border-t border-slate-600">
            <p className="text-sm text-slate-400 text-center">
              ועוד {activities.length - 8} פעולות...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 