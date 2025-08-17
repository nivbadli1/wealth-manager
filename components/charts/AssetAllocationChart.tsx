"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface AssetAllocationChartProps {
  data: {
    name: string
    value: number
    color: string
    percentage?: number
  }[]
  title: string
}

export function AssetAllocationChart({ data, title }: AssetAllocationChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: Record<string, unknown> }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-slate-300">
            ערך: ₪{data.value.toLocaleString()}
          </p>
          {data.percentage && (
            <p className="text-slate-300">
              אחוז: {data.percentage.toFixed(1)}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: { payload?: Array<{ color: string; value: string }> }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300 text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-white font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage?.toFixed(1) || 0}%`}
            labelLine={false}
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