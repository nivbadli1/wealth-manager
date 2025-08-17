"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface PerformanceComparisonChartProps {
  data: Array<Record<string, unknown>>
  title: string
}

export function PerformanceComparisonChart({ data, title }: PerformanceComparisonChartProps) {
  // Transform property data for the chart
  const chartData = data.map(property => ({
    name: property.title || property.name,
    purchaseValue: property.purchasePrice || property.initialAmount || 0,
    currentValue: property.currentValue || property.value || 0,
    roi: property.roi || ((property.currentValue - property.purchasePrice) / property.purchasePrice * 100) || 0
  }))

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="text-slate-300 text-sm">
              <span style={{ color: entry.color }}>
                {entry.dataKey === 'purchaseValue' ? 'ערך רכישה' : 
                 entry.dataKey === 'currentValue' ? 'ערך נוכחי' : 'תשואה'}:
              </span>
              {entry.dataKey === 'roi' ? 
                ` ${entry.value.toFixed(1)}%` : 
                ` ₪${entry.value.toLocaleString()}`
              }
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-white font-semibold mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="name" 
            stroke="#cbd5e1"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#cbd5e1" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#cbd5e1' }}
            formatter={(value) => {
              switch(value) {
                case 'purchaseValue': return 'ערך רכישה'
                case 'currentValue': return 'ערך נוכחי'
                case 'roi': return 'תשואה (%)'
                default: return value
              }
            }}
          />
          <Bar dataKey="purchaseValue" fill="#3b82f6" name="purchaseValue" />
          <Bar dataKey="currentValue" fill="#10b981" name="currentValue" />
          <Bar dataKey="roi" fill="#f59e0b" name="roi" yAxisId="right" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}