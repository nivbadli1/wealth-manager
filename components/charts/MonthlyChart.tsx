"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface MonthlyData {
  month: string
  income: number
  expenses: number
  profit: number
}

interface MonthlyChartProps {
  data: MonthlyData[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="month" 
          stroke="#cbd5e1"
          fontSize={10}
          interval="preserveStartEnd"
        />
        <YAxis 
          stroke="#cbd5e1"
          fontSize={10}
          tickFormatter={(value) => formatCurrency(value).replace('₪', '')}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#10b981" 
          strokeWidth={2}
          name="הכנסות"
          dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#ef4444" 
          strokeWidth={2}
          name="הוצאות"
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey="profit" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="רווח נטו"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 