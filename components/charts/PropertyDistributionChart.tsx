"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
// import { formatCurrency } from '@/lib/utils'

interface PropertyDistributionData {
  name: string
  value: number
  color: string
}

interface PropertyDistributionChartProps {
  data: PropertyDistributionData[]
  title: string
}

export function PropertyDistributionChart({ data, title }: PropertyDistributionChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: PropertyDistributionData }> }) => {
    if (active && payload && payload.length) {
      const tooltipData = payload[0]
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-1">{tooltipData.payload.name}</p>
          <p className="text-sm" style={{ color: tooltipData.payload.color }}>
            {tooltipData.payload.value} נכסים
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: { payload?: Array<{ color: string; value: string }> }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
        {payload?.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-1 sm:gap-2">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs sm:text-sm text-slate-300">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 