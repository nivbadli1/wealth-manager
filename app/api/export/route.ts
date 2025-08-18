import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const format = searchParams.get('format') || 'json'

    let data: unknown = {}

    // Fetch data based on type
    switch (type) {
      case 'properties':
        data = await prisma.property.findMany({
          include: {
            RentalIncome: true,
            PropertyExpense: true,
            Mortgage: true
          }
        })
        break
      
      case 'investments':
        data = await prisma.investment.findMany()
        break
      
      case 'income':
        data = await prisma.income.findMany()
        break
      
      case 'expenses':
        data = await prisma.expense.findMany()
        break
      
      case 'all':
        data = {
          properties: await prisma.property.findMany({
            include: {
              RentalIncome: true,
              PropertyExpense: true,
              Mortgage: true
            }
          }),
          investments: await prisma.investment.findMany(),
          income: await prisma.income.findMany(),
          expenses: await prisma.expense.findMany(),
          exportDate: new Date().toISOString(),
          version: '1.0'
        }
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Format data based on requested format
    let exportData: string
    let contentType: string
    let filename: string

    switch (format) {
      case 'json':
        exportData = JSON.stringify(data, null, 2)
        contentType = 'application/json'
        filename = `wealth-manager-${type}-${new Date().toISOString().split('T')[0]}.json`
        break
      
      case 'csv':
        if (type === 'all') {
          exportData = generateCSVForAllData(data)
        } else {
          exportData = generateCSV(data)
        }
        contentType = 'text/csv'
        filename = `wealth-manager-${type}-${new Date().toISOString().split('T')[0]}.csv`
        break
      
      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        )
    }

    return new NextResponse(exportData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

function generateCSV(data: unknown): string {
  if (!Array.isArray(data) || data.length === 0) {
    return 'No data available'
  }

  const dataArray = data as Record<string, unknown>[]
  const headers = Object.keys(dataArray[0])
  const csvRows = [headers.join(',')]

  for (const row of dataArray) {
    const values = headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}

function generateCSVForAllData(data: unknown): string {
  const sections = []
  const dataObj = data as Record<string, unknown[]>
  
  // Properties section
  if (dataObj.properties && dataObj.properties.length > 0) {
    sections.push('=== PROPERTIES ===')
    sections.push(generateCSV(dataObj.properties))
    sections.push('')
  }
  
  // Investments section
  if (dataObj.investments && dataObj.investments.length > 0) {
    sections.push('=== INVESTMENTS ===')
    sections.push(generateCSV(dataObj.investments))
    sections.push('')
  }
  
  // Income section
  if (dataObj.income && dataObj.income.length > 0) {
    sections.push('=== INCOME ===')
    sections.push(generateCSV(dataObj.income))
    sections.push('')
  }
  
  // Expenses section
  if (dataObj.expenses && dataObj.expenses.length > 0) {
    sections.push('=== EXPENSES ===')
    sections.push(generateCSV(dataObj.expenses))
    sections.push('')
  }
  
  // Export metadata
  sections.push('=== EXPORT INFO ===')
  sections.push(`Export Date,${dataObj.exportDate}`)
  sections.push(`Version,${dataObj.version}`)
  sections.push(`Total Properties,${dataObj.properties?.length || 0}`)
  sections.push(`Total Investments,${dataObj.investments?.length || 0}`)
  sections.push(`Total Income Records,${dataObj.income?.length || 0}`)
  sections.push(`Total Expense Records,${dataObj.expenses?.length || 0}`)
  
  return sections.join('\n')
} 